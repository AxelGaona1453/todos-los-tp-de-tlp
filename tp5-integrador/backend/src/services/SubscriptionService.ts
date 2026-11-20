import { ConflictError, NotFoundError } from '../errors/AppError';
import { Subscription } from '../models/Subscription';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';

export class SubscriptionService {
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly ticketRepository: ITicketRepository;

  constructor(subscriptionRepository: ISubscriptionRepository, ticketRepository: ITicketRepository) {
    this.subscriptionRepository = subscriptionRepository;
    this.ticketRepository = ticketRepository;
  }

  async listTicketIds(userId: string): Promise<string[]> {
    return this.subscriptionRepository.findTicketIdsByUser(userId);
  }

  async subscribe(userId: string, ticketId: string): Promise<Subscription> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket no encontrado');
    }
    if (await this.subscriptionRepository.exists(userId, ticketId)) {
      throw new ConflictError('Ya estás suscripto a este ticket');
    }
    return this.subscriptionRepository.create(userId, ticketId);
  }

  async unsubscribe(userId: string, ticketId: string): Promise<void> {
    const deleted = await this.subscriptionRepository.delete(userId, ticketId);
    if (!deleted) {
      throw new NotFoundError('No estás suscripto a este ticket');
    }
  }
}
