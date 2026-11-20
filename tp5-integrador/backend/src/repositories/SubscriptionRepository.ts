import { Subscriber, Subscription, SubscriptionModel } from '../models/Subscription';
import { ISubscriptionRepository } from './interfaces/ISubscriptionRepository';
import { toId } from './objectId';

interface SubscriptionDoc {
  _id: unknown;
  user: unknown;
  ticket: unknown;
  createdAt: Date;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: string, ticketId: string): Promise<Subscription> {
    const created = await SubscriptionModel.create({ user: userId, ticket: ticketId });
    const doc = created.toObject() as SubscriptionDoc;
    return { id: toId(doc._id), userId, ticketId, createdAt: doc.createdAt };
  }

  async delete(userId: string, ticketId: string): Promise<boolean> {
    const result = await SubscriptionModel.deleteOne({ user: userId, ticket: ticketId });
    return result.deletedCount > 0;
  }

  async exists(userId: string, ticketId: string): Promise<boolean> {
    return (await SubscriptionModel.exists({ user: userId, ticket: ticketId })) !== null;
  }

  async findTicketIdsByUser(userId: string): Promise<string[]> {
    const docs = await SubscriptionModel.find({ user: userId }).lean<SubscriptionDoc[]>();
    return docs.map((doc) => toId(doc.ticket));
  }

  async findSubscribersByTicket(ticketId: string): Promise<Subscriber[]> {
    const docs = await SubscriptionModel.find({ ticket: ticketId })
      .populate('user', 'email')
      .lean<SubscriptionDoc[]>();

    return docs
      .filter((doc) => doc.user !== null)
      .map((doc) => ({
        userId: toId(doc.user),
        email: (doc.user as { email: string }).email
      }));
  }

  async deleteByTicket(ticketId: string): Promise<void> {
    await SubscriptionModel.deleteMany({ ticket: ticketId });
  }
}
