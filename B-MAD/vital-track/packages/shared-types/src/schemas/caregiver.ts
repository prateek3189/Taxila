import { z } from 'zod';
import {
  CAREGIVER_INVITE_STATUSES,
  CAREGIVER_PERMISSION_LEVELS,
} from '../models/caregiver';

export const caregiverPermissionLevelSchema = z.enum(CAREGIVER_PERMISSION_LEVELS);
export const caregiverInviteStatusSchema = z.enum(CAREGIVER_INVITE_STATUSES);

export const caregiverInviteSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().min(1),
  inviteeEmail: z.string().email(),
  permissionLevel: caregiverPermissionLevelSchema,
  status: caregiverInviteStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
