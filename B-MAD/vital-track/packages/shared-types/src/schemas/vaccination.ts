import { z } from 'zod';
import {
  VACCINATION_RECORD_STATES,
  VACCINE_PLAN_STATUSES,
} from '../models/vaccination';

export const vaccinationRecordStateSchema = z.enum(VACCINATION_RECORD_STATES);
export const vaccinePlanStatusSchema = z.enum(VACCINE_PLAN_STATUSES);

export const vaccineEntrySchema = z.object({
  id: z.string().min(1),
  vaccineName: z.string().min(1).max(300),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(2000).optional(),
});

export const vaccinePlanSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1),
  doctorId: z.string().min(1),
  status: vaccinePlanStatusSchema,
  entries: z.array(vaccineEntrySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const vaccinationRecordSchema = z.object({
  id: z.string().min(1),
  childId: z.string().min(1),
  doctorId: z.string().min(1).optional(),
  vaccineName: z.string().min(1).max(300),
  state: vaccinationRecordStateSchema,
  lotNumber: z.string().max(100).optional(),
  administeredAt: z.string().datetime().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  pendingExpiresAt: z.string().datetime().optional(),
  rejectionNote: z.string().max(2000).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
