import { z } from 'zod';

export const registerBodySchema = z
  .object({
    displayName: z.string().min(1).max(200),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['parent', 'doctor']),
    clinicDetails: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const loginBodySchema = z
  .object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(1),
  })
  .strict();

export const refreshBodySchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

export const logoutBodySchema = refreshBodySchema;

export const forgotPasswordBodySchema = z
  .object({
    email: z.string().email().toLowerCase(),
  })
  .strict();

export const resetPasswordBodySchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .strict();

export const caregiverInviteBodySchema = z
  .object({
    inviteeEmail: z.string().email().toLowerCase(),
    permissionLevel: z.enum(['read_only', 'full']),
  })
  .strict();

export const caregiverAcceptBodySchema = z
  .object({
    displayName: z.string().min(1).max(200).optional(),
    password: z.string().min(8).optional(),
  })
  .strict();

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
