import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter';
import { InAppNotifier } from './InAppNotifier';
import { INotifier } from './INotifier';

export type NotifierType = 'inapp' | 'console';

/**
 * Factory: centraliza la creación de canales. Quien la usa pide un canal por su tipo
 * y recibe un INotifier, sin conocer (ni instanciar con `new`) las clases concretas.
 */
export class NotifierFactory {
  private readonly notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  create(type: NotifierType): INotifier {
    switch (type) {
      case 'inapp':
        return new InAppNotifier(this.notificationRepository);
      case 'console':
        return new ConsoleNotifierAdapter();
      default: {
        const unknownType: never = type;
        throw new Error(`Canal de notificación no soportado: ${String(unknownType)}`);
      }
    }
  }
}
