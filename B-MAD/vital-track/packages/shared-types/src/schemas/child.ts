import { z } from 'zod';

export const childSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().min(1),
  name: z.string().min(1).max(200),
  parentPhoneNumber: z.string().min(5).max(32),
  childIdCode: z.string().length(6),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
