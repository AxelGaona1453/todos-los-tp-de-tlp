import { CreateTicketData, Ticket, TicketModel, TicketStatus, UpdateTicketData } from '../models/Ticket';
import { ITicketRepository } from './interfaces/ITicketRepository';
import { isValidId, toId } from './objectId';

interface TicketDoc {
  _id: unknown;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: unknown;
  createdAt: Date;
  updatedAt: Date;
}

function toTicket(doc: TicketDoc): Ticket {
  return {
    id: toId(doc._id),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    createdBy: toId(doc.createdBy),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export class TicketRepository implements ITicketRepository {
  async findAll(): Promise<Ticket[]> {
    const docs = await TicketModel.find().sort({ createdAt: -1 }).lean<TicketDoc[]>();
    return docs.map(toTicket);
  }

  async findById(id: string): Promise<Ticket | null> {
    if (!isValidId(id)) return null;
    const doc = await TicketModel.findById(id).lean<TicketDoc>();
    return doc ? toTicket(doc) : null;
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    const created = await TicketModel.create(data);
    return toTicket(created.toObject() as TicketDoc);
  }

  async update(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    if (!isValidId(id)) return null;
    const doc = await TicketModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean<TicketDoc>();
    return doc ? toTicket(doc) : null;
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket | null> {
    if (!isValidId(id)) return null;
    const doc = await TicketModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean<TicketDoc>();
    return doc ? toTicket(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidId(id)) return false;
    const result = await TicketModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
