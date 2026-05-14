import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import type { ApiEnv } from '@vital-track/config';
import { APP_VERSION } from '@vital-track/shared-types';
import { getSwaggerSpec } from './config/swagger';
import { success } from './lib/envelope';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { createV1Router } from './routes/v1';

export function createApp(env: ApiEnv) {
  const app = express();
  const useCompiledSwaggerPaths = __dirname.includes('dist');

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json(success({ status: 'ok', version: APP_VERSION }));
  });

  app.use('/api/v1', createV1Router(env));

  if (env.SWAGGER_ENABLED) {
    const spec = getSwaggerSpec(env, useCompiledSwaggerPaths);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
