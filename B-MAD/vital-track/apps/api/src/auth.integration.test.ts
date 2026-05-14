import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { parseApiEnv } from '@vital-track/config';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './db/connection';

const baseEnv = {
  PORT: '3000',
  NODE_ENV: 'test' as const,
  JWT_SECRET: 'test-secret-key-minimum-32-characters',
  CORS_ORIGIN: 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX: '300',
  RATE_LIMIT_ADMIN_MAX: '60',
  SWAGGER_ENABLED: 'false',
};

describe('Auth (integration)', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDatabase(mongod.getUri());
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await disconnectDatabase();
    await mongod.stop();
  });

  it('registers, logs in, and returns /auth/me', async () => {
    const testEnv = parseApiEnv(baseEnv);
    const app = createApp(testEnv);

    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({
        displayName: 'Test Parent',
        email: 'parent@example.com',
        password: 'password12',
        role: 'parent',
      })
      .expect(201);

    expect(reg.body.success).toBe(true);
    expect(reg.body.data.email).toBe('parent@example.com');

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'parent@example.com', password: 'password12' })
      .expect(200);

    expect(login.body.data.accessToken).toBeDefined();
    const token = login.body.data.accessToken as string;

    const me = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.data.email).toBe('parent@example.com');
    expect(me.body.data.role).toBe('parent');
  });

  it('invalidates all sessions when a rotated refresh token is reused (Story 2.2)', async () => {
    const testEnv = parseApiEnv(baseEnv);
    const app = createApp(testEnv);

    await request(app).post('/api/v1/auth/register').send({
      displayName: 'Reuse Test',
      email: 'reuse@example.com',
      password: 'password12',
      role: 'parent',
    });

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'reuse@example.com', password: 'password12' })
      .expect(200);

    const r1 = login.body.data.refreshToken as string;

    const refreshed = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: r1 })
      .expect(200);

    const r2 = refreshed.body.data.refreshToken as string;

    const reuse = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: r1 })
      .expect(401);

    expect(reuse.body.error.code).toBe('REFRESH_TOKEN_REUSE');

    await request(app).post('/api/v1/auth/refresh').send({ refreshToken: r2 }).expect(401);
  });

  it('returns 403 when a parent calls doctor-only RBAC probe (Story 2.2)', async () => {
    const testEnv = parseApiEnv(baseEnv);
    const app = createApp(testEnv);

    await request(app).post('/api/v1/auth/register').send({
      displayName: 'Parent Only',
      email: 'parent-only@example.com',
      password: 'password12',
      role: 'parent',
    });

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'parent-only@example.com', password: 'password12' })
      .expect(200);

    const res = await request(app)
      .get('/api/v1/auth/rbac/doctor')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('allows a doctor to call GET /auth/rbac/doctor', async () => {
    const testEnv = parseApiEnv(baseEnv);
    const app = createApp(testEnv);

    await request(app)
      .post('/api/v1/auth/register')
      .send({
        displayName: 'Dr Test',
        email: 'doctor@example.com',
        password: 'password12',
        role: 'doctor',
        clinicDetails: { name: 'Test Clinic' },
      })
      .expect(201);

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'doctor@example.com', password: 'password12' })
      .expect(200);

    const res = await request(app)
      .get('/api/v1/auth/rbac/doctor')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .expect(200);

    expect(res.body.data.ok).toBe(true);
  });

  it('returns 200 for forgot-password when email is unknown (no enumeration, Story 2.3)', async () => {
    const testEnv = parseApiEnv(baseEnv);
    const app = createApp(testEnv);

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'not-registered@example.com' })
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});
