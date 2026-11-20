import { TicketStatus } from '../models/Ticket';

/** Evento que publica TicketService cuando un ticket cambia de estado. */
export interface TicketStatusChangedEvent {
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  changedBy: string;
  occurredAt: Date;
}
