import { CreateTicketData, Ticket, TicketStatus, UpdateTicketData } from '../../models/Ticket';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(data: CreateTicketData): Promise<Ticket>;
  update(id: string, data: UpdateTicketData): Promise<Ticket | null>;
  updateStatus(id: string, status: TicketStatus): Promise<Ticket | null>;
  delete(id: string): Promise<boolean>;
}
