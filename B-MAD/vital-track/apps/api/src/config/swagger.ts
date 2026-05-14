import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import type { ApiEnv } from '@vital-track/config';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'vital-track API',
    version: '1.0.0',
    description: 'REST API for vaccination records, ChildID, and multi-portal access.',
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http' as const,
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export function buildSwaggerSpec(_env: ApiEnv) {
  return swaggerJsdoc({
    definition: swaggerDefinition,
    apis: [path.join(__dirname, '../routes/v1/**/*.js')],
  }) as Record<string, unknown>;
}

/** Source paths for `ts-node` / development */
export function buildSwaggerSpecFromSource(_env: ApiEnv) {
  return swaggerJsdoc({
    definition: swaggerDefinition,
    apis: [path.join(__dirname, '../routes/v1/**/*.ts')],
  }) as Record<string, unknown>;
}

export function getSwaggerSpec(env: ApiEnv, useCompiledRoutes: boolean) {
  if (useCompiledRoutes) {
    return buildSwaggerSpec(env);
  }
  return buildSwaggerSpecFromSource(env);
}
