import { NotFoundError } from '../errors/AppError';
import { Notification, StoredNotification } from '../models/Notification';
import { NotifierFactory, NotifierType } from '../notifications/NotifierFactory';
import { TicketStatusChangedEvent } from '../observer/events';
import { IObserver } from '../observer/IObserver';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';

/**
 * Observer del cambio de estado de tickets + bandeja de notificaciones del usuario.
 * Solo conoce INotifier: nunca llama a console.log ni instancia canales con `new`.
 */
export class NotificationService implements IObserver<TicketStatusChangedEvent> {
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly notificationRepository: INotificationRepository;
  private readonly notifierFactory: NotifierFactory;
  private readonly channels: NotifierType[];

  constructor(
    subscriptionRepository: ISubscriptionRepository,
    notificationRepository: INotificationRepository,
    notifierFactory: NotifierFactory,
    channels: NotifierType[]
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.notificationRepository = notificationRepository;
    this.notifierFactory = notifierFactory;
    this.channels = channels;
  }

  /** Se ejecuta cada vez que el EventPublisher avisa un cambio de estado. */
  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscribers = await this.subscriptionRepository.findSubscribersByTicket(event.ticketId);
    const notifiers = this.channels.map((channel) => this.notifierFactory.create(channel));

    for (const subscriber of subscribers) {
      const notification: Notification = {
        userId: subscriber.userId,
        userEmail: subscriber.email,
        ticketId: event.ticketId,
        ticketTitle: event.ticketTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message: `El ticket "${event.ticketTitle}" cambió de ${event.previousStatus} a ${event.newStatus}`
      };

      await Promise.all(notifiers.map((notifier) => notifier.send(notification)));
    }
  }

  async listForUser(userId: string): Promise<StoredNotification[]> {
    return this.notificationRepository.findByUser(userId);
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const updated = await this.notificationRepository.markAsRead(notificationId, userId);
    if (!updated) {
      throw new NotFoundError('Notificación no encontrada');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
