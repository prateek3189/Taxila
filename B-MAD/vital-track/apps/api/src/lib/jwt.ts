import jwt from 'jsonwebtoken';
import type { ApiEnv } from '@vital-track/config';
import type { UserRole } from '@vital-track/shared-types';
import { AppError } from './AppError';

export interface AccessPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function signAccessToken(env: ApiEnv, payload: AccessPayload): string {
  return jwt.sign(
    { typ: 'access', email: payload.email, role: payload.role },
    env.JWT_SECRET,
    { subject: payload.sub, expiresIn: `${env.JWT_ACCESS_EXPIRES_MIN}m` },
  );
}

export function verifyAccessToken(env: ApiEnv, token: string): AccessPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & {
      typ?: string;
      email?: string;
      role?: UserRole;
    };
    if (decoded.typ !== 'access' || !decoded.sub || !decoded.email || !decoded.role) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid access token');
    }
    return { sub: decoded.sub, email: decoded.email, role: decoded.role };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired access token');
  }
}

export function resetSecret(env: ApiEnv): string {
  return env.JWT_RESET_SECRET ?? env.JWT_SECRET;
}
