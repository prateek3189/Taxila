import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { APP_VERSION } = require('@vital-track/shared-types');

assert.match(APP_VERSION, /^\d+\.\d+\.\d+/, 'APP_VERSION semver-shaped');
console.log('mobile smoke ok', APP_VERSION);
