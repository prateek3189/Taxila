import request from 'supertest';
import { parseApiEnv } from '@vital-track/config';
import { createApp } from './app';

const testEnv = parseApiEnv({
  PORT: '3000',
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret-key-minimum-32-characters',
  CORS_ORIGIN: 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX: '300',
  RATE_LIMIT_ADMIN_MAX: '60',
  SWAGGER_ENABLED: 'false',
});

const app = createApp(testEnv);

describe('API envelope', () => {
  it('GET /health returns success envelope', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toEqual({
      success: true,
      data: expect.objectContaining({ status: 'ok' }),
    });
  });

  it('GET /api/v1/health returns version', async () => {
    const res = await request(app).get('/api/v1/health').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.version).toBe('string');
  });

  it('returns AppError envelope for unknown routes', async () => {
    const res = await request(app).get('/api/v1/no-such-route').expect(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('AppError serialization', () => {
  it('throws structured error for bad input when validated', async () => {
    const { AppError } = await import('./lib/AppError');
    const err = new AppError(400, 'VALIDATION_ERROR', 'Invalid input', { field: 'email' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});
