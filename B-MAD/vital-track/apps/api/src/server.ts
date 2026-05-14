import './load-env';
import { parseApiEnv, type ApiEnv } from '@vital-track/config';
import { createApp } from './app';
import { connectDatabaseWithDevFallback } from './db/connection';

function loadEnv(): ApiEnv {
  try {
    return parseApiEnv(process.env);
  } catch (err) {
    console.error('Invalid environment configuration.');
    console.error(err);
    return process.exit(1) as never;
  }
}

const env = loadEnv();
export const app = createApp(env);

if (require.main === module) {
  void connectDatabaseWithDevFallback(env)
    .then(() => {
      app.listen(env.PORT, () => {
        console.log(`vital-track API running on port ${env.PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB.');
      console.error(err);
      process.exit(1);
    });
}
