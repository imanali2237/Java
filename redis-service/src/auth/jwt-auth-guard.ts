import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from './decoraters/public.decorater';

import { RedisService } from '../redis-service/redis-service';
import { prisma } from '../lib/prisma';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
      private readonly redisService: RedisService,
  ) {}

  async canActivate(
      context: ExecutionContext,
  ): Promise<boolean> {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.logger.debug(`[${requestId}] JWT Guard activation started`);

    const isPublic =
        this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [
              context.getHandler(),
              context.getClass(),
            ],
        );

    if (isPublic) {
      this.logger.debug(`[${requestId}] Public route detected - skipping JWT verification`);
      return true;
    }

    const request =
        context.switchToHttp().getRequest();

    const auth =
        request.headers.authorization;
    this.logger.debug(`[${requestId}] Request headers received`);

    if (!auth || !auth.startsWith('Bearer ')) {
      this.logger.warn(`[${requestId}] Missing or invalid authorization header`);
      throw new UnauthorizedException(
          'Missing token',
      );
    }

    const token =
        auth.split(' ')[1];

    let payload;

    try {
      this.logger.debug(`[${requestId}] Verifying JWT token...`);
      const verifyStart = Date.now();

       payload =
           await this.jwtService.verifyAsync(
               token,
               {
                 secret:
                 process.env.JWT_ACCESS_TOKEN_SECRET || 'dev-access-token-secret-change-me',
               },
           );

      const verifyTime = Date.now() - verifyStart;
      this.logger.debug(`[${requestId}] JWT verification completed in ${verifyTime}ms`);

     } catch (error) {
       this.logger.error(`[${requestId}] JWT verification failed: ${error.message}`);
       throw new UnauthorizedException(
           'Invalid or expired token',
       );
     }

    const userId = payload.sub;
    this.logger.debug(`[${requestId}] JWT decoded - userId: ${userId}`);

    if (!userId) {
      this.logger.warn(`[${requestId}] No userId in JWT payload`);
      throw new UnauthorizedException();
    }

    // 1. Check Redis
    this.logger.debug(`[${requestId}] Checking Redis cache for user:${userId}...`);
    const redisStart = Date.now();

    let user =
        await this.redisService.get(
            `user1s:${userId}`,
        );

    const redisTime = Date.now() - redisStart;

    // 2. If missing -> MongoDB
    if (!user) {
      this.logger.warn(`[${requestId}] User not found in Redis (${redisTime}ms). Querying MongoDB...`);
      const dbStart = Date.now();

      user =
          await prisma.user.findUnique({
            where:{
              id:userId,
            },

            select:{
              id:true,
              username:true,
              role:true,
              isActive:true,
            },

          });

      const dbTime = Date.now() - dbStart;
      this.logger.debug(`[${requestId}] MongoDB query completed in ${dbTime}ms`);

      if (!user) {
        this.logger.error(`[${requestId}] User not found in MongoDB - userId: ${userId}`);
        throw new UnauthorizedException(
            'User not found',
        );
      }

      this.logger.log(
        `[${requestId}] ⚡ PERFORMANCE COMPARISON - Redis miss (${redisTime}ms) vs MongoDB hit (${dbTime}ms) - DB was ${dbTime > redisTime ? 'SLOWER' : 'FASTER'} by ${Math.abs(dbTime - redisTime)}ms`,
      );

      // 3. Store cache
      this.logger.debug(`[${requestId}] Caching user in Redis for 1 hour...`);
      const cacheStart = Date.now();

      await this.redisService.set(
          `user:${userId}`,
          user,
          3600,
      );

      const cacheTime = Date.now() - cacheStart;
      this.logger.debug(`[${requestId}] User cached in Redis in ${cacheTime}ms`);

    } else {
      this.logger.log(
        `[${requestId}] ✅ User retrieved from Redis in ${redisTime}ms (CACHE HIT)`,
      );
    }

    // attach user to request
    request.user = user;
    this.logger.debug(`[${requestId}] User attached to request - Authorization complete`);

    return true;
  }

}