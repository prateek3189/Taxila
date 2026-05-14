import rateLimit from 'express-rate-limit';
import type { ApiEnv } from '@vital-track/config';

export function createApiLimiter(env: ApiEnv) {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        details: {},
      },
    },
  });
}

export function createAdminLimiter(env: ApiEnv) {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_ADMIN_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests (admin tier)',
        details: {},
      },
    },
  });
}
