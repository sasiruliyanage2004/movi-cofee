export type NotificationChannel = "whatsapp" | "email" | "sms" | "system";
export type NotificationStatus = "pending" | "sent" | "failed";

export interface PlatformNotification {
  id: string;
  reservationId?: string | null;
  channel: NotificationChannel;
  recipient: string;
  title: string;
  body: string;
  status: NotificationStatus;
  sentAt?: string | null;
  createdAt: string;
}
