import { APP_VERSION } from '@vital-track/shared-types';

export const appConfig = {
  version: APP_VERSION,
} as const;

export {
  apiEnvSchema,
  mobileEnvSchema,
  parseApiEnv,
  parseMobileEnv,
  parseWebEnv,
  webEnvSchema,
  type ApiEnv,
  type MobileEnv,
  type WebEnv,
} from './env';
