import { z } from 'zod';
import { USER_ROLES, VERIFICATION_STATUSES } from '../models/user';

export const userRoleSchema = z.enum(USER_ROLES);
export const verificationStatusSchema = z.enum(VERIFICATION_STATUSES);

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  role: userRoleSchema,
  displayName: z.string().min(1).max(200),
  verificationStatus: verificationStatusSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
