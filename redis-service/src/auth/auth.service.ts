import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import {
  AuthenticatedUser,
  JwtPayload,
  LoginResponse,
  RefreshJwtPayload,
} from './auth.types';
import { ExtractedDeviceInfo } from './device.util';
import {RedisService} from "../redis-service/redis-service";

@Injectable()
export class AuthService {
  private readonly seedUserId = '6855f82f44f9e15b6d6f0c11';
  private readonly refreshTokenExpiryDays = 7;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService:RedisService
  ) {}

  async signup(
    username: string,
    password: string,
    deviceInfo: ExtractedDeviceInfo,
  ): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'user',
        isActive: true,
      },
    });

    await this.redisService.set(
        this.getUserCacheKey(newUser.id),
        {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
        3600,
    );
    // Create session and tokens
    return this.createSessionAndTokens(newUser.id, newUser.username, newUser.role, deviceInfo);
  }

  async login(
    username: string,
    password: string,
    deviceInfo: ExtractedDeviceInfo,
  ): Promise<LoginResponse> {
    await this.ensureSeedUser();

    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Create session and tokens for this device
    return this.createSessionAndTokens(user.userId, user.username, user.role, deviceInfo);
  }

  async refreshTokens(
    refreshToken: string,
    deviceInfo: ExtractedDeviceInfo,
  ): Promise<LoginResponse> {
    try {
      // Find the session in database
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session) {
        throw new UnauthorizedException('Refresh token not found. Please login again.');
      }

      // Check if token is expired
      if (new Date() > session.expiresAt) {
        // Delete expired session
        await prisma.session.delete({ where: { id: session.id } });
        throw new UnauthorizedException('Refresh token expired. Please login again.');
      }

      // Verify device matches
      if (session.deviceFingerprint !== deviceInfo.deviceFingerprint) {
        // Device mismatch - security breach, delete all sessions for this user
        await prisma.session.deleteMany({
          where: { userId: session.userId },
        });

         new UnauthorizedException(
          'Device verification failed. All sessions have been terminated for security. Please login again.',
        );
      }

      // Decode refresh token to get user info
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'dev-refresh-token-secret-change-me',
      });

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found. Please login again.');
      }

      // Update session's lastUsedAt
      await prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      });
      await this.redisService.set(
          this.getUserCacheKey(user.id),
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          3600,
      );

      // Generate new tokens
      return this.generateTokensForSession(
        user.id,
        user.username,
        user.role,
        session.id,
        deviceInfo,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token. Please login again.');
    }
  }

  private async createSessionAndTokens(
    userId: string,
    username: string,
    role: string,
    deviceInfo: ExtractedDeviceInfo,
  ): Promise<LoginResponse> {
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenExpiryDays);

    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId,
        deviceName: deviceInfo.deviceName,
        userAgent: deviceInfo.userAgent,
        ipAddress: deviceInfo.ipAddress,
        deviceFingerprint: deviceInfo.deviceFingerprint,
        expiresAt,
        refreshToken: '', // Temporary, will be updated
        lastUsedAt: new Date(),
      },
    });

    // Generate tokens with session info
    return this.generateTokensForSession(userId, username, role, session.id, deviceInfo);
  }

  private async generateTokensForSession(
    userId: string,
    username: string,
    role: string,
    sessionId: string,
    deviceInfo: ExtractedDeviceInfo,
  ): Promise<LoginResponse> {
    const accessPayload: JwtPayload = {
      sub: userId,
      username,
      role,
      tokenType: 'access',
      sessionId,
      deviceFingerprint: deviceInfo.deviceFingerprint,
    };

    const refreshPayload: RefreshJwtPayload = {
      sub: userId,
      username,
      role,
      tokenType: 'refresh',
      refreshToken: '',
      sessionId,
      deviceFingerprint: deviceInfo.deviceFingerprint,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'dev-access-token-secret-change-me',
      expiresIn: '15m',
    });

    // Generate unique refresh token
    const refreshTokenValue = `${Date.now()}-${Math.random().toString(36).slice(2)}-${sessionId}`;
    refreshPayload.refreshToken = refreshTokenValue;

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'dev-refresh-token-secret-change-me',
      expiresIn: `${this.refreshTokenExpiryDays}d`,
    });

    // Update session with refresh token
    await prisma.session.update({
      where: { id: sessionId },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        userId,
        username,
        role,
      },
      device: deviceInfo,
    };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const foundUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!foundUser) {
      return null;
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthenticatedUser> {
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    return {
      userId: session.userId,
      username: session.user.username,
      role: session.user.role,
    };
  }

  async getUserSessions(userId: string) {
    return prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        deviceName: true,
        userAgent: true,
        ipAddress: true,
        deviceFingerprint: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async deleteSession(userId: string, sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new UnauthorizedException('Session not found or unauthorized');
    }

    await prisma.session.delete({ where: { id: sessionId } });
    return { message: 'Session deleted successfully' };
  }

  async deleteAllOtherSessions(userId: string, currentSessionId: string) {
    await prisma.session.deleteMany({
      where: {
        userId,
        id: { not: currentSessionId },
      },
    });
    return { message: 'All other sessions deleted' };
  }

  private async ensureSeedUser(): Promise<void> {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      },
      create: {
        id: this.seedUserId,
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });
  }
  private getUserCacheKey(userId:string){
    return `user:${userId}`;
  }
}

