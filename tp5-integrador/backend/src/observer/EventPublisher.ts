import { IObserver } from './IObserver';
import { ISubject } from './ISubject';

/**
 * Subject concreto del patrón Observer (implementación propia, sin EventEmitter).
 * No sabe qué hacen los observers: solo los registra y les reenvía el evento.
 */
export class EventPublisher<TEvent> implements ISubject<TEvent> {
  private observers: IObserver<TEvent>[] = [];

  attach(observer: IObserver<TEvent>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver<TEvent>): void {
    this.observers = this.observers.filter((current) => current !== observer);
  }

  async notify(event: TEvent): Promise<void> {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        // Un observer que falla no debe impedir que los demás reciban el evento
        // ni revertir la operación que lo originó.
        console.error('[EventPublisher] Error en un observer:', error);
      }
    }
  }
}
