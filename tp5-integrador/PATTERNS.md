# Patrones de diseño y principios SOLID

Los cuatro patrones participan del mismo flujo: el **cambio de estado de un ticket**.

```
TicketController.changeStatus()            (PATCH /api/tickets/:id/status)
 └─> TicketService.changeStatus()
      └─> EventPublisher.notify(evento)                ← Observer (Subject)
           └─> NotificationService.update(evento)      ← Observer (Observer)
                ├─ SubscriptionRepository.findSubscribersByTicket()
                │     └─ modelos registrados en DatabaseConnection   ← Singleton
                └─ NotifierFactory.create('inapp')     ← Factory
                   NotifierFactory.create('console')
                      └─ ConsoleNotifierAdapter        ← Adapter
                           └─ console.log
```

---

## Singleton — `DatabaseConnection`

**Archivos:** `backend/src/database/DatabaseConnection.ts` (uso en `backend/src/main.ts`, `backend/src/database/runSeed.ts`
y en cada modelo de `backend/src/models/`).

**Problema que resuelve:** la aplicación necesita una única conexión a MongoDB compartida por todos los repositorios.
Con el constructor privado nadie puede crear una segunda instancia por error; todos obtienen la misma con
`getInstance()`, y todos los modelos se registran sobre esa conexión.

```ts
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly connection: Connection;

  private constructor() {
    this.connection = mongoose.connection;
  }

  static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// models/Ticket.ts
export const TicketModel = DatabaseConnection.getInstance().getConnection().model('Ticket', ticketSchema);
```

## Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

**Archivos:** `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts`,
`backend/src/observer/EventPublisher.ts`, `backend/src/observer/events.ts`, `backend/src/services/NotificationService.ts`,
`backend/src/services/TicketService.ts` y el registro en `backend/src/main.ts`.

**Problema que resuelve:** `TicketService` no debe saber quién reacciona a un cambio de estado. Solo avisa al
`EventPublisher` (Subject), que reenvía el evento a los observers registrados. Así se pueden sumar reacciones nuevas
(auditoría, métricas, etc.) sin tocar `TicketService`. La implementación es propia, sin `EventEmitter`.

```ts
// EventPublisher.ts (Subject)
async notify(event: TEvent): Promise<void> {
  for (const observer of this.observers) {
    await observer.update(event);
  }
}

// TicketService.ts
await this.eventPublisher.notify({ ticketId: updated.id, previousStatus: current.status, newStatus: updated.status, ... });

// main.ts
ticketEvents.attach(notificationService);
```

> Observers ≠ suscripciones: los observers son objetos del backend (`NotificationService`); las suscripciones son datos
> en la base (qué usuario sigue qué ticket). `NotificationService.update()` consulta las suscripciones para saber a quién notificar.

## Factory — `NotifierFactory`

**Archivos:** `backend/src/notifications/NotifierFactory.ts`, `backend/src/notifications/INotifier.ts`,
`backend/src/notifications/InAppNotifier.ts`.

**Problema que resuelve:** `NotificationService` necesita canales de notificación pero no debe conocer las clases
concretas ni sus dependencias (el canal in-app necesita el repositorio). La factory centraliza la creación: recibe el
tipo de canal y devuelve un `INotifier`. `NotificationService` nunca hace `new` de un canal.

```ts
export type NotifierType = 'inapp' | 'console';

create(type: NotifierType): INotifier {
  switch (type) {
    case 'inapp':
      return new InAppNotifier(this.notificationRepository);
    case 'console':
      return new ConsoleNotifierAdapter();
  }
}

// NotificationService.ts
const notifiers = this.channels.map((channel) => this.notifierFactory.create(channel));
```

## Adapter — `ConsoleNotifierAdapter`

**Archivo:** `backend/src/notifications/ConsoleNotifierAdapter.ts`.

**Problema que resuelve:** el sistema espera que todo canal cumpla `INotifier` (recibe un objeto `Notification` y devuelve
una `Promise`), pero `console.log` recibe texto y no devuelve nada. El adaptador implementa `INotifier`, transforma la
notificación en una línea de texto legible y se la pasa a `console.log`.

```ts
export class ConsoleNotifierAdapter implements INotifier {
  constructor(private log: (text: string) => void = console.log) {}   // (simplificado)

  async send(notification: Notification): Promise<void> {
    const text =
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | ` +
      `Ticket #${notification.ticketId} "${notification.ticketTitle}" | ` +
      `Estado: ${notification.previousStatus} → ${notification.newStatus}`;
    this.log(text);
  }
}
```

---

## S — Responsabilidad única

**Archivos:** `backend/src/controllers/TicketController.ts`, `backend/src/services/TicketService.ts`,
`backend/src/repositories/TicketRepository.ts` (y lo mismo en los demás módulos); `backend/src/services/TokenService.ts`.

**Problema que resuelve:** cada capa cambia por un único motivo: el controller por cambios en HTTP (validación y
respuesta), el service por cambios en reglas de negocio, el repository por cambios en la persistencia. `TokenService`
solo firma y verifica JWT, separado de `AuthService`.

```ts
// Controller: valida y responde (no tiene lógica de negocio)
changeStatus = async (req: Request, res: Response) => {
  const status = requireOneOf(getBody(req), 'status', TICKET_STATUSES);
  const ticket = await this.ticketService.changeStatus(param(req, 'id'), status, currentUser(req).email);
  res.json(ticket);
};
```

## O — Abierto/cerrado

**Archivos:** `backend/src/services/NotificationService.ts`, `backend/src/notifications/NotifierFactory.ts`,
`backend/src/main.ts`.

**Problema que resuelve:** para agregar un canal nuevo (por ejemplo, email) se crea una clase que implemente `INotifier`,
se agrega su `case` en la factory y su nombre en la lista `channels` de `main.ts`. `NotificationService` **no se modifica**:
recorre los canales que le pasan y solo conoce `INotifier`.

```ts
// main.ts
const channels: NotifierType[] = ['inapp', 'console'];   // agregar 'email' acá
const notificationService = new NotificationService(subscriptionRepository, notificationRepository, notifierFactory, channels);
```

## L — Sustitución de Liskov

**Archivos:** `backend/src/notifications/InAppNotifier.ts`, `backend/src/notifications/ConsoleNotifierAdapter.ts`,
`backend/src/services/NotificationService.ts`.

**Problema que resuelve:** cualquier `INotifier` puede reemplazar a otro sin que `NotificationService` cambie su
comportamiento ni tenga que preguntar de qué tipo es: todos reciben una `Notification` y devuelven una `Promise<void>`.
Lo mismo vale para los repositorios: un repositorio en memoria que implemente `ITicketRepository` podría reemplazar al de Mongo.

```ts
await Promise.all(notifiers.map((notifier) => notifier.send(notification)));
```

## I — Segregación de interfaces

**Archivos:** `backend/src/repositories/interfaces/*.ts`, `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts`.

**Problema que resuelve:** en lugar de un repositorio genérico gigante, cada entidad tiene una interfaz chica con solo
los métodos que sus clientes necesitan. `TicketService` depende de `ISubject` (no de `EventPublisher` entero) e
`INotifier` tiene un único método.

```ts
export interface INotificationRepository {
  create(notification: Notification): Promise<StoredNotification>;
  findByUser(userId: string): Promise<StoredNotification[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<void>;
}
```

## D — Inversión de dependencias

**Archivos:** todos los `backend/src/services/*.ts` y el composition root `backend/src/main.ts`.

**Problema que resuelve:** los services dependen de **interfaces** (`ITicketRepository`, `ISubscriptionRepository`,
`ISubject`...) y las reciben por constructor. Las implementaciones concretas se eligen en un único lugar (`main.ts`),
así se pueden cambiar (otra base de datos, dobles de prueba) sin tocar la lógica de negocio.

```ts
export class TicketService {
  constructor(
    ticketRepository: ITicketRepository,
    subscriptionRepository: ISubscriptionRepository,
    eventPublisher: ISubject<TicketStatusChangedEvent>
  ) { ... }
}

// main.ts (composition root)
const ticketService = new TicketService(ticketRepository, subscriptionRepository, ticketEvents);
```
