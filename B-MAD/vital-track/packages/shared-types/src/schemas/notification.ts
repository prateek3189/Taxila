import { z } from 'zod';
import { NOTIFICATION_CHANNELS } from '../models/notification';

export const notificationChannelSchema = z.enum(NOTIFICATION_CHANNELS);

export const notificationPayloadSchema = z.object({
  id: z.string().min(1),
  channel: notificationChannelSchema,
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(8000),
  data: z.record(z.string(), z.unknown()).optional(),
  recipientUserId: z.string().min(1),
  createdAt: z.string().datetime(),
});
