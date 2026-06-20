import { Body, Controller, Get, Post, Req, Logger } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {  LoginRequestDto, SignupRequestDto, TokenPairDto } from './dto/auth.dto';

import { extractDeviceInfo } from './device.util';
import { Public } from "./decoraters/public.decorater";

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up with username and password' })
  @ApiBody({ type: SignupRequestDto })
  @ApiOkResponse({ type: TokenPairDto })
  @ApiBadRequestResponse({ description: 'Username already exists' })
  @Public()
  @Post('signup')
  async signup(@Body() body: SignupRequestDto, @Req() req: Request) {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    this.logger.log(`[${requestId}] Signup request received - username: ${body.username}`);
    this.logger.debug(`[${requestId}] Device info: ${body.deviceName || 'Auto-detected'}`);

    try {
      const deviceInfo = extractDeviceInfo(req, body.deviceName);
      this.logger.debug(`[${requestId}] Device fingerprint: ${deviceInfo.deviceFingerprint}`);
      this.logger.debug(`[${requestId}] Device name: ${deviceInfo.deviceName}`);
      this.logger.debug(`[${requestId}] IP Address: ${deviceInfo.ipAddress}`);

      const signupStart = Date.now();
      const result = await this.authService.signup(body.username, body.password, deviceInfo);
      const signupTime = Date.now() - signupStart;

      const totalTime = Date.now() - startTime;
      this.logger.log(`[${requestId}] ✅ Signup successful in ${signupTime}ms (Total: ${totalTime}ms) - userId: ${result.user.userId}`);

      return result;
    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.logger.error(`[${requestId}] ❌ Signup failed after ${totalTime}ms - Error: ${error.message}`);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({ type: TokenPairDto })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
  @Public()
  @Post('login')
  async login(@Body() body: LoginRequestDto, @Req() req: Request) {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    this.logger.log(`[${requestId}] Login request received - username: ${body.username}`);
    this.logger.debug(`[${requestId}] Device info: ${body.deviceName || 'Auto-detected'}`);

    try {
      const deviceInfo = extractDeviceInfo(req, body.deviceName);
      this.logger.debug(`[${requestId}] Device fingerprint: ${deviceInfo.deviceFingerprint}`);
      this.logger.debug(`[${requestId}] Device name: ${deviceInfo.deviceName}`);
      this.logger.debug(`[${requestId}] IP Address: ${deviceInfo.ipAddress}`);

      const loginStart = Date.now();
      const result = await this.authService.login(body.username, body.password, deviceInfo);
      const loginTime = Date.now() - loginStart;

      const totalTime = Date.now() - startTime;
      this.logger.log(`[${requestId}] ✅ Login successful in ${loginTime}ms (Total: ${totalTime}ms) - userId: ${result.user.userId}`);
      this.logger.debug(`[${requestId}] Session created - sessionId: ${result.device.deviceFingerprint}`);

      return result;
    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.logger.error(`[${requestId}] ❌ Login failed after ${totalTime}ms - Error: ${error.message}`);
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @Get('profile')
  getProfile(@Req() req:any) {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`[${requestId}] Profile request - userId: ${req?.user?.id}`);

    if (!req?.user) {
      this.logger.warn(`[${requestId}] No user attached to request`);
    } else {
      this.logger.debug(`[${requestId}] User profile: ${JSON.stringify(req.user)}`);
    }

    return req?.user;
  }

}

