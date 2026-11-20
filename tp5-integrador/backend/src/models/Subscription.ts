import { Schema, Types } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';

export interface Subscription {
  id: string;
  userId: string;
  ticketId: string;
  createdAt: Date;
}

/** Suscriptor con el email ya resuelto (lo necesita NotificationService). */
export interface Subscriber {
  userId: string;
  email: string;
}

const subscriptionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    ticket: { type: Types.ObjectId, ref: 'Ticket', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Un usuario no puede suscribirse dos veces al mismo ticket.
subscriptionSchema.index({ user: 1, ticket: 1 }, { unique: true });

export const SubscriptionModel = DatabaseConnection.getInstance()
  .getConnection()
  .model('Subscription', subscriptionSchema);
