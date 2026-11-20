import { Notification, NotificationModel, StoredNotification } from '../models/Notification';
import { TicketStatus } from '../models/Ticket';
import { INotificationRepository } from './interfaces/INotificationRepository';
import { isValidId, toId } from './objectId';

interface NotificationDoc {
  _id: unknown;
  user: unknown;
  userEmail: string;
  ticket: unknown;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  message: string;
  read: boolean;
  createdAt: Date;
}

function toStored(doc: NotificationDoc): StoredNotification {
  return {
    id: toId(doc._id),
    userId: toId(doc.user),
    userEmail: doc.userEmail,
    ticketId: toId(doc.ticket),
    ticketTitle: doc.ticketTitle,
    previousStatus: doc.previousStatus,
    newStatus: doc.newStatus,
    message: doc.message,
    read: doc.read,
    createdAt: doc.createdAt
  };
}

export class NotificationRepository implements INotificationRepository {
  async create(notification: Notification): Promise<StoredNotification> {
    const created = await NotificationModel.create({
      user: notification.userId,
      userEmail: notification.userEmail,
      ticket: notification.ticketId,
      ticketTitle: notification.ticketTitle,
      previousStatus: notification.previousStatus,
      newStatus: notification.newStatus,
      message: notification.message
    });
    return toStored(created.toObject() as NotificationDoc);
  }

  async findByUser(userId: string): Promise<StoredNotification[]> {
    const docs = await NotificationModel.find({ user: userId }).sort({ createdAt: -1 }).lean<NotificationDoc[]>();
    return docs.map(toStored);
  }

  async countUnread(userId: string): Promise<number> {
    return NotificationModel.countDocuments({ user: userId, read: false });
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    if (!isValidId(id)) return false;
    // Se filtra también por usuario: nadie puede marcar notificaciones ajenas.
    const result = await NotificationModel.updateOne({ _id: id, user: userId }, { read: true });
    return result.matchedCount > 0;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ user: userId, read: false }, { read: true });
  }
}
