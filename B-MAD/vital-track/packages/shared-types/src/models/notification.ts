export const NOTIFICATION_CHANNELS = ['email', 'sms', 'push'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export interface NotificationPayload {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  recipientUserId: string;
  createdAt: string;
}
