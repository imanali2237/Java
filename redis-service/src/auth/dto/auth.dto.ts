import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'Chrome on Windows', description: 'Device name for identification', required: false })
  deviceName?: string;
}

export class SignupRequestDto {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'SecurePass123!' })
  password: string;

  @ApiProperty({ example: 'Chrome on MacOS', description: 'Device name for identification', required: false })
  deviceName?: string;
}

export class AuthUserDto {
  @ApiProperty({ example: '6855f82f44f9e15b6d6f0c11' })
  userId: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}

export class DeviceInfoDto {
  @ApiProperty({ example: 'Chrome on Windows' })
  deviceName: string;

  @ApiProperty({ example: 'Mozilla/5.0...' })
  userAgent: string;

  @ApiProperty({ example: '192.168.1.1' })
  ipAddress: string;

  @ApiProperty({ example: 'device-fingerprint-123' })
  deviceFingerprint: string;
}

export class SessionInfoDto {
  @ApiProperty({ example: 'session-id-123' })
  sessionId: string;

  @ApiProperty({ type: () => DeviceInfoDto })
  device: DeviceInfoDto;

  @ApiProperty({ example: '2026-06-21T10:30:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-06-21T12:30:00Z' })
  lastUsedAt: string;
}

export class TokenPairDto {
  @ApiProperty({
    description: 'JWT access token used for protected endpoints',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token used to renew access tokens',
  })
  refreshToken: string;

  @ApiProperty({ type: () => AuthUserDto })
  user: AuthUserDto;

  @ApiProperty({ type: () => DeviceInfoDto, description: 'Device information for this session' })
  device: DeviceInfoDto;
}

