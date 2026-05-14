import type { NextFunction, Request, Response } from 'express';
import type { ApiEnv } from '@vital-track/config';
import { AppError } from '../lib/AppError';
import { verifyAccessToken } from '../lib/jwt';

export function authenticate(env: ApiEnv) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid Authorization header'));
      return;
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      next(new AppError(401, 'UNAUTHORIZED', 'Missing bearer token'));
      return;
    }
    try {
      const payload = verifyAccessToken(env, token);
      req.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch (err) {
      next(err instanceof AppError ? err : new AppError(401, 'UNAUTHORIZED', 'Invalid token'));
    }
  };
}
