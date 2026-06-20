import { ExtractedDeviceInfo } from './device.util';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  tokenType: 'access' | 'refresh';
  sessionId?: string;
  deviceFingerprint?: string;
}

export interface RefreshJwtPayload extends JwtPayload {
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
  device: ExtractedDeviceInfo;
}


