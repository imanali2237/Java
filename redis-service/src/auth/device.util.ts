import { Request } from 'express';
import * as crypto from 'crypto';

export interface ExtractedDeviceInfo {
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  deviceFingerprint: string;
}

/**
 * Extracts device information from Express request
 */
export function extractDeviceInfo(req: Request, customDeviceName?: string): ExtractedDeviceInfo {
  const userAgent = req.get('user-agent') || 'Unknown';
  const ipAddress = extractIpAddress(req);

  // Generate device fingerprint from user agent and IP
  const deviceFingerprint = generateDeviceFingerprint(userAgent, ipAddress);

  // Use custom device name if provided, otherwise generate from user agent
  const deviceName = customDeviceName || generateDeviceNameFromUserAgent(userAgent);

  return {
    deviceName,
    userAgent,
    ipAddress,
    deviceFingerprint,
  };
}

/**
 * Extracts client IP address from request
 */
function extractIpAddress(req: Request): string {
  const forwarded = req.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'Unknown';
}

/**
 * Generates a unique device fingerprint
 */
function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  const combined = `${userAgent}${ipAddress}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

/**
 * Extracts device name from user agent string
 */
function generateDeviceNameFromUserAgent(userAgent: string): string {
  // Parse user agent to extract browser and OS
  if (!userAgent) return 'Unknown Device';

  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS X') || userAgent.includes('Macintosh')) {
    os = 'MacOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) {
    os = 'iOS';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  }

  return `${browser} on ${os}`;
}

