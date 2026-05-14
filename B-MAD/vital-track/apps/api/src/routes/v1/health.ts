import { Router } from 'express';
import { APP_VERSION } from '@vital-track/shared-types';
import { success } from '../../lib/envelope';

export const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Liveness and version
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     version:
 *                       type: string
 */
healthRouter.get('/health', (_req, res) => {
  res.json(success({ status: 'ok', version: APP_VERSION }));
});
