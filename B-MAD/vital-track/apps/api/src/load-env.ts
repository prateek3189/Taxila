import path from 'path';
import { config } from 'dotenv';

/** Load repo-root `.env` so `pnpm --filter api dev` picks up `JWT_SECRET` without manual `export`. */
const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });
