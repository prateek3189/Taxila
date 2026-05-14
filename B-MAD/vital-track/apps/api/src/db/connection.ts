import mongoose from 'mongoose';
import type { ApiEnv } from '@vital-track/config';
import type { MongoMemoryServer } from 'mongodb-memory-server';

let devMemoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
}

/** True when URI targets a local mongod (not Atlas). Used to avoid masking Atlas auth/network errors. */
function isLocalMongoUri(uri: string): boolean {
  if (uri.startsWith('mongodb+srv://')) return false;
  return /mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/|$|\?)/i.test(uri);
}

/**
 * Connects to `MONGODB_URI`. In development, if local Mongo is unreachable and
 * `MONGODB_MEMORY_FALLBACK` is not `false`, uses mongodb-memory-server so `npm run dev` works without Docker.
 */
export async function connectDatabaseWithDevFallback(env: ApiEnv): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(env.MONGODB_URI);
    return;
  } catch (err) {
    const allowMemory =
      env.NODE_ENV === 'development' &&
      process.env.MONGODB_MEMORY_FALLBACK !== 'false' &&
      isLocalMongoUri(env.MONGODB_URI);
    if (!allowMemory) {
      throw err;
    }
    console.warn(
      '[dev] MongoDB unreachable at MONGODB_URI; using in-memory MongoDB (data is lost on restart). Start local MongoDB or set MONGODB_MEMORY_FALLBACK=false to fail fast.',
    );
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    devMemoryServer = await MongoMemoryServer.create();
    await mongoose.connect(devMemoryServer.getUri());
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (devMemoryServer) {
    await devMemoryServer.stop();
    devMemoryServer = null;
  }
}
