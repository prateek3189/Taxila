import { createHash, randomBytes } from 'crypto';

export function generateOpaqueToken(): string {
  return randomBytes(48).toString('hex');
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
