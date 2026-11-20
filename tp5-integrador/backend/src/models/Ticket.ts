import { Schema, Types } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';

export const TICKET_STATUSES = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketData {
  title: string;
  description: string;
  createdBy: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
}

const ticketSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: TICKET_STATUSES, default: 'ABIERTO', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const TicketModel = DatabaseConnection.getInstance().getConnection().model('Ticket', ticketSchema);
