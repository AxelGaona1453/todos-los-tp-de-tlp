import { Schema, Types } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { TICKET_STATUSES, TicketStatus } from './Ticket';

/** Notificación que viaja por los canales (INotifier). */
export interface Notification {
  userId: string;
  userEmail: string;
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  message: string;
}

/** Notificación persistida (canal in-app). */
export interface StoredNotification extends Notification {
  id: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    ticket: { type: Types.ObjectId, ref: 'Ticket', required: true },
    ticketTitle: { type: String, required: true },
    previousStatus: { type: String, enum: TICKET_STATUSES, required: true },
    newStatus: { type: String, enum: TICKET_STATUSES, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const NotificationModel = DatabaseConnection.getInstance()
  .getConnection()
  .model('Notification', notificationSchema);
