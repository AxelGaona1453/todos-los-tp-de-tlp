import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { currentUser, getBody, param, requireString } from './validation';

export class SubscriptionController {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  /** IDs de los tickets a los que está suscripto el usuario logueado. */
  listMine = async (req: Request, res: Response) => {
    const ticketIds = await this.subscriptionService.listTicketIds(currentUser(req).id);
    res.json({ ticketIds });
  };

  subscribe = async (req: Request, res: Response) => {
    const ticketId = requireString(getBody(req), 'ticketId');
    const subscription = await this.subscriptionService.subscribe(currentUser(req).id, ticketId);
    res.status(201).json(subscription);
  };

  unsubscribe = async (req: Request, res: Response) => {
    await this.subscriptionService.unsubscribe(currentUser(req).id, param(req, 'ticketId'));
    res.status(204).send();
  };
}
