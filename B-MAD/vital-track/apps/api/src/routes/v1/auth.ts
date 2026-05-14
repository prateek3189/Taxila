import { Router } from 'express';
import type { ApiEnv } from '@vital-track/config';
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
} from '@vital-track/shared-types';
import { asyncHandler } from '../../lib/asyncHandler';
import { success } from '../../lib/envelope';
import { authenticate } from '../../middleware/authenticate';
import { requireRole } from '../../middleware/requireRole';
import {
  forgotPassword,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
  resetPassword,
} from '../../services/auth.service';

export function createAuthRouter(env: ApiEnv) {
  const router = Router();

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register parent or doctor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [displayName, email, password, role]
   *             properties:
   *               displayName: { type: string }
   *               email: { type: string, format: email }
   *               password: { type: string, minLength: 8 }
   *               role: { type: string, enum: [parent, doctor] }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
      const parsed = registerBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      const data = await registerUser(env, parsed.data);
      res.status(201).json(success(data));
    }),
  );

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login and obtain tokens
   */
  router.post(
    '/login',
    asyncHandler(async (req, res, next) => {
      const parsed = loginBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      const data = await loginUser(env, parsed.data);
      res.json(success(data));
    }),
  );

  router.post(
    '/refresh',
    asyncHandler(async (req, res, next) => {
      const parsed = refreshBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      const data = await refreshSession(env, parsed.data.refreshToken);
      res.json(success(data));
    }),
  );

  router.post(
    '/logout',
    asyncHandler(async (req, res, next) => {
      const parsed = logoutBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      await logoutSession(parsed.data.refreshToken);
      res.json(success({ loggedOut: true }));
    }),
  );

  router.post(
    '/forgot-password',
    asyncHandler(async (req, res, next) => {
      const parsed = forgotPasswordBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      await forgotPassword(env, parsed.data.email);
      res.json(success({ ok: true }));
    }),
  );

  router.post(
    '/reset-password',
    asyncHandler(async (req, res, next) => {
      const parsed = resetPasswordBodySchema.safeParse(req.body);
      if (!parsed.success) {
        next(parsed.error);
        return;
      }
      await resetPassword(parsed.data.token, parsed.data.newPassword);
      res.json(success({ ok: true }));
    }),
  );

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Current user from access token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   */
  router.get(
    '/me',
    authenticate(env),
    asyncHandler(async (req, res) => {
      res.json(success({ userId: req.user!.userId, email: req.user!.email, role: req.user!.role }));
    }),
  );

  /**
   * RBAC probe: only `doctor` role succeeds (Story 2.2).
   * @openapi
   * /auth/rbac/doctor:
   *   get:
   *     tags: [Auth]
   *     summary: Doctor-only route probe
   *     security:
   *       - bearerAuth: []
   */
  router.get(
    '/rbac/doctor',
    authenticate(env),
    requireRole('doctor'),
    asyncHandler(async (_req, res) => {
      res.json(success({ ok: true, role: 'doctor' }));
    }),
  );

  return router;
}
