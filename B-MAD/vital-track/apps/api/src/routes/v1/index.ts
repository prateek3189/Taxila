import { Router } from 'express';
import type { ApiEnv } from '@vital-track/config';
import { createAdminLimiter, createApiLimiter } from '../../middleware/rateLimit';
import { adminRouter } from './admin';
import { createAuthRouter } from './auth';
import { createCaregiversRouter } from './caregivers';
import { healthRouter } from './health';

export function createV1Router(env: ApiEnv) {
  const router = Router();
  const apiLimiter = createApiLimiter(env);
  const adminLimiter = createAdminLimiter(env);

  router.use(apiLimiter);
  router.use('/auth', createAuthRouter(env));
  router.use('/caregivers', createCaregiversRouter(env));
  router.use(healthRouter);
  router.use('/admin', adminLimiter, adminRouter);

  return router;
}
