import { z } from 'zod';

export const auditLogEntrySchema = z.object({
  id: z.string().min(1),
  actorId: z.string().min(1),
  actorRole: z.string().min(1),
  action: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
});
