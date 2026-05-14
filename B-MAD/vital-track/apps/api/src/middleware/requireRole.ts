import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@vital-track/shared-types';
import { AppError } from '../lib/AppError';

export function requireRole(...allowed: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
      return;
    }
    if (!allowed.includes(req.user.role)) {
      next(new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role'));
      return;
    }
    next();
  };
}
