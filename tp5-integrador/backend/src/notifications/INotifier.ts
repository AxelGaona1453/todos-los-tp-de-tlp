import { Notification } from '../models/Notification';

/** Contrato común de todos los canales de notificación. */
export interface INotifier {
  send(notification: Notification): Promise<void>;
}
