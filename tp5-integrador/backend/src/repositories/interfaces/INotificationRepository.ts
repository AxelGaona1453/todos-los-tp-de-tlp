import { Notification, StoredNotification } from '../../models/Notification';

export interface INotificationRepository {
  create(notification: Notification): Promise<StoredNotification>;
  findByUser(userId: string): Promise<StoredNotification[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<void>;
}
