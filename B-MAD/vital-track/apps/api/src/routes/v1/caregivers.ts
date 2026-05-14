import { Router } from 'express';
import type { ApiEnv } from '@vital-track/config';
import { caregiverAcceptBodySchema, caregiverInviteBodySchema } from '@vital-track/shared-types';
import { AppError } from '../../lib/AppError';
import { asyncHandler } from '../../lib/asyncHandler';
import { success } from '../../lib/envelope';
import { verifyAccessToken } from '../../lib/jwt';
import { authenticate } from '../../middleware/authenticate';
import { requireCaregiverWriteAccess } from '../../middleware/requireCaregiverWrite';
import { requireRole } from '../../middleware/requireRole';
import {
  acceptInvite,
  createInvite,
  declineInvite,
  revokeCaregiverAccess,
} from '../../services/caregiver.service';

export function createCaregiversRouter(env: ApiEnv) {
  const router = Router();

  router.post(
    '/invite',
    authenticate(env),
    requireRole('parent'),
    asyncHandler(async (req, res, next) => {
      const parsed = caregiverInviteBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      const out = await createInvite(env, req.user!.userId, parsed.data.inviteeEmail, parsed.data.permissionLevel);
      res.status(201).json(success(out));
    }),
  );

  router.post(
    '/invite/:token/accept',
    asyncHandler(async (req, res, next) => {
      const token = req.params.token;
      if (!token) {
        next(new AppError(400, 'VALIDATION_ERROR', 'Missing invite token'));
        return;
      }
      const bodyParsed = caregiverAcceptBodySchema.safeParse(req.body ?? {});
      if (!bodyParsed.success) {
        next(bodyParsed.error);
        return;
      }
      const authHeader = req.headers.authorization;
      let userId: string | undefined;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const payload = verifyAccessToken(env, authHeader.slice('Bearer '.length).trim());
          userId = payload.sub;
        } catch {
          /* optional auth */
        }
      }
      const out = await acceptInvite(token, bodyParsed.data, userId);
      res.json(success(out));
    }),
  );

  router.post(
    '/invite/:token/decline',
    asyncHandler(async (req, res, next) => {
      const token = req.params.token;
      if (!token) {
        next(new AppError(400, 'VALIDATION_ERROR', 'Missing invite token'));
        return;
      }
      const out = await declineInvite(token);
      res.json(success(out));
    }),
  );

  router.delete(
    '/:caregiverUserId',
    authenticate(env),
    requireRole('parent'),
    asyncHandler(async (req, res) => {
      await revokeCaregiverAccess(req.user!.userId, req.params.caregiverUserId);
      res.json(success({ revoked: true }));
    }),
  );

  /** Example write-guarded route (read_only caregivers get 403). */
  router.post(
    '/parent/:parentId/write-probe',
    authenticate(env),
    requireCaregiverWriteAccess('parentId'),
    asyncHandler(async (_req, res) => {
      res.json(success({ write: true }));
    }),
  );

  return router;
}
