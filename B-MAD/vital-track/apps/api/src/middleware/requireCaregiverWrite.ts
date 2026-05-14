import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/AppError';
import { CaregiverAccessModel } from '../models/CaregiverAccess';

/**
 * Blocks caregivers with read_only from mutating routes (Epic 2 Story 2.4).
 * Parents and other roles pass through.
 */
export function requireCaregiverWriteAccess(parentIdParam = 'parentId') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
        return;
      }
      if (req.user.role !== 'caregiver') {
        next();
        return;
      }
      const parentId = req.params[parentIdParam] ?? req.body?.[parentIdParam];
      if (!parentId || typeof parentId !== 'string') {
        next(new AppError(400, 'VALIDATION_ERROR', 'Parent context required'));
        return;
      }
      const access = await CaregiverAccessModel.findOne({
        parentId,
        caregiverId: req.user.userId,
        active: true,
      });
      if (!access || access.permissionLevel === 'read_only') {
        next(new AppError(403, 'FORBIDDEN', 'Read-only caregivers cannot perform this action'));
        return;
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}

/** Epic 2.4 name for write-guard middleware. */
export const requirePermission = requireCaregiverWriteAccess;
