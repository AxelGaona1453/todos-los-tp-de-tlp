import { Notification } from '../models/Notification';
import { INotifier } from './INotifier';

/** Firma de console.log: recibe texto y no devuelve nada (la interfaz "incompatible"). */
type TextLogger = (text: string) => void;

/**
 * Adapter: la app espera un INotifier (recibe un objeto Notification y devuelve una Promise),
 * pero console.log recibe texto y no devuelve nada. Este adaptador traduce entre ambas formas.
 */
export class ConsoleNotifierAdapter implements INotifier {
  private readonly log: TextLogger;

  constructor(log: TextLogger = console.log) {
    this.log = log;
  }

  async send(notification: Notification): Promise<void> {
    const text =
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | ` +
      `Ticket #${notification.ticketId} "${notification.ticketTitle}" | ` +
      `Estado: ${notification.previousStatus} → ${notification.newStatus}`;

    this.log(text);
  }
}
