import { Subscriber, Subscription } from '../../models/Subscription';

export interface ISubscriptionRepository {
  create(userId: string, ticketId: string): Promise<Subscription>;
  delete(userId: string, ticketId: string): Promise<boolean>;
  exists(userId: string, ticketId: string): Promise<boolean>;
  findTicketIdsByUser(userId: string): Promise<string[]>;
  findSubscribersByTicket(ticketId: string): Promise<Subscriber[]>;
  deleteByTicket(ticketId: string): Promise<void>;
}
