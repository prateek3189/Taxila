import { Router } from 'express';
import { success } from '../../lib/envelope';

export const adminRouter = Router();

/**
 * @openapi
 * /admin/ping:
 *   get:
 *     tags: [Admin]
 *     summary: Admin tier probe (stricter rate limit)
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get('/ping', (_req, res) => {
  res.json(success({ pong: true }));
});
