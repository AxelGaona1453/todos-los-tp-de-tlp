import { Notification } from '../models/Notification';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { INotifier } from './INotifier';

/** Canal in-app: guarda la notificación en la base de datos (queda como no leída). */
export class InAppNotifier implements INotifier {
  private readonly notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async send(notification: Notification): Promise<void> {
    await this.notificationRepository.create(notification);
  }
}
