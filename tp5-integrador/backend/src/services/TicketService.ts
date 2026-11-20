import { NotFoundError, ValidationError } from '../errors/AppError';
import { CreateTicketData, Ticket, TicketStatus, UpdateTicketData } from '../models/Ticket';
import { TicketStatusChangedEvent } from '../observer/events';
import { ISubject } from '../observer/ISubject';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';

/** Lógica de negocio de tickets. No conoce Express (no recibe req ni res). */
export class TicketService {
  private readonly ticketRepository: ITicketRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly eventPublisher: ISubject<TicketStatusChangedEvent>;

  constructor(
    ticketRepository: ITicketRepository,
    subscriptionRepository: ISubscriptionRepository,
    eventPublisher: ISubject<TicketStatusChangedEvent>
  ) {
    this.ticketRepository = ticketRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.eventPublisher = eventPublisher;
  }

  async list(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }

  async getById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket no encontrado');
    }
    return ticket;
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    return this.ticketRepository.create(data);
  }

  async update(id: string, data: UpdateTicketData): Promise<Ticket> {
    const ticket = await this.ticketRepository.update(id, data);
    if (!ticket) {
      throw new NotFoundError('Ticket no encontrado');
    }
    return ticket;
  }

  async changeStatus(id: string, newStatus: TicketStatus, changedBy: string): Promise<Ticket> {
    const current = await this.getById(id);
    if (current.status === newStatus) {
      throw new ValidationError(`El ticket ya está en estado ${newStatus}`);
    }

    const updated = await this.ticketRepository.updateStatus(id, newStatus);
    if (!updated) {
      throw new NotFoundError('Ticket no encontrado');
    }

    // Observer: se avisa al Subject y él reenvía el evento a todos sus observers.
    await this.eventPublisher.notify({
      ticketId: updated.id,
      ticketTitle: updated.title,
      previousStatus: current.status,
      newStatus: updated.status,
      changedBy,
      occurredAt: new Date()
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.ticketRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Ticket no encontrado');
    }
    await this.subscriptionRepository.deleteByTicket(id);
  }
}
