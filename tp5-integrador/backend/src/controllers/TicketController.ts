import { Request, Response } from 'express';
import { ValidationError } from '../errors/AppError';
import { TICKET_STATUSES } from '../models/Ticket';
import { TicketService } from '../services/TicketService';
import { currentUser, getBody, optionalString, param, requireOneOf, requireString } from './validation';

export class TicketController {
  private readonly ticketService: TicketService;

  constructor(ticketService: TicketService) {
    this.ticketService = ticketService;
  }

  list = async (_req: Request, res: Response) => {
    res.json(await this.ticketService.list());
  };

  getById = async (req: Request, res: Response) => {
    res.json(await this.ticketService.getById(param(req, 'id')));
  };

  create = async (req: Request, res: Response) => {
    const body = getBody(req);
    const ticket = await this.ticketService.create({
      title: requireString(body, 'title', 'título'),
      description: requireString(body, 'description', 'descripción'),
      createdBy: currentUser(req).id
    });
    res.status(201).json(ticket);
  };

  update = async (req: Request, res: Response) => {
    const body = getBody(req);
    if ('status' in body) {
      throw new ValidationError('El estado se cambia con PATCH /api/tickets/:id/status');
    }
    const title = optionalString(body, 'title', 'título');
    const description = optionalString(body, 'description', 'descripción');
    if (title === undefined && description === undefined) {
      throw new ValidationError('Enviá al menos "title" o "description"');
    }

    const ticket = await this.ticketService.update(param(req, 'id'), { title, description });
    res.json(ticket);
  };

  changeStatus = async (req: Request, res: Response) => {
    const status = requireOneOf(getBody(req), 'status', TICKET_STATUSES);
    const ticket = await this.ticketService.changeStatus(param(req, 'id'), status, currentUser(req).email);
    res.json(ticket);
  };

  delete = async (req: Request, res: Response) => {
    await this.ticketService.delete(param(req, 'id'));
    res.status(204).send();
  };
}
