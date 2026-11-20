import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { currentUser, param } from './validation';

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  list = async (req: Request, res: Response) => {
    res.json(await this.notificationService.listForUser(currentUser(req).id));
  };

  unreadCount = async (req: Request, res: Response) => {
    const count = await this.notificationService.countUnread(currentUser(req).id);
    res.json({ count });
  };

  markAsRead = async (req: Request, res: Response) => {
    await this.notificationService.markAsRead(param(req, 'id'), currentUser(req).id);
    res.status(204).send();
  };

  markAllAsRead = async (req: Request, res: Response) => {
    await this.notificationService.markAllAsRead(currentUser(req).id);
    res.status(204).send();
  };
}
