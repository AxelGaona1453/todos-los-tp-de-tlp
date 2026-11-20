import { createApp } from './app';
import { env } from './config/env';
import { AuthController } from './controllers/AuthController';
import { NotificationController } from './controllers/NotificationController';
import { SubscriptionController } from './controllers/SubscriptionController';
import { TicketController } from './controllers/TicketController';
import { UserController } from './controllers/UserController';
import { DatabaseConnection } from './database/DatabaseConnection';
import { runSeed } from './database/seed';
import { createAuthenticate } from './middlewares/authenticate';
import { NotifierFactory, NotifierType } from './notifications/NotifierFactory';
import { TicketStatusChangedEvent } from './observer/events';
import { EventPublisher } from './observer/EventPublisher';
import { NotificationRepository } from './repositories/NotificationRepository';
import { RoleRepository } from './repositories/RoleRepository';
import { SubscriptionRepository } from './repositories/SubscriptionRepository';
import { TicketRepository } from './repositories/TicketRepository';
import { UserRepository } from './repositories/UserRepository';
import { createAuthRouter } from './routes/auth.routes';
import { createNotificationRouter } from './routes/notification.routes';
import { createSubscriptionRouter } from './routes/subscription.routes';
import { createTicketRouter } from './routes/ticket.routes';
import { createUserRouter } from './routes/user.routes';
import { AuthService } from './services/AuthService';
import { NotificationService } from './services/NotificationService';
import { SubscriptionService } from './services/SubscriptionService';
import { TicketService } from './services/TicketService';
import { TokenService } from './services/TokenService';
import { UserService } from './services/UserService';

/**
 * Composition root: el ÚNICO lugar donde se crean los objetos con `new`
 * y se conectan entre sí por constructor.
 */
async function main(): Promise<void> {
  // Singleton: única conexión a la base para toda la app.
  await DatabaseConnection.getInstance().connect(env.mongoUri);
  await runSeed();

  // Repositorios
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const ticketRepository = new TicketRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const notificationRepository = new NotificationRepository();

  // Observer + Factory (+ Adapter dentro de la factory)
  const ticketEvents = new EventPublisher<TicketStatusChangedEvent>();
  const notifierFactory = new NotifierFactory(notificationRepository);
  const channels: NotifierType[] = ['inapp', 'console'];

  // Servicios
  const tokenService = new TokenService(env.jwtSecret, env.jwtExpiresIn);
  const authService = new AuthService(userRepository, roleRepository, tokenService);
  const userService = new UserService(userRepository, roleRepository);
  const ticketService = new TicketService(ticketRepository, subscriptionRepository, ticketEvents);
  const subscriptionService = new SubscriptionService(subscriptionRepository, ticketRepository);
  const notificationService = new NotificationService(
    subscriptionRepository,
    notificationRepository,
    notifierFactory,
    channels
  );

  // NotificationService se suscribe (como observer) a los cambios de estado de tickets.
  ticketEvents.attach(notificationService);

  // Middlewares, controllers y rutas
  const authenticate = createAuthenticate(authService);
  const app = createApp(
    {
      auth: createAuthRouter(new AuthController(authService), authenticate),
      users: createUserRouter(new UserController(userService), authenticate),
      tickets: createTicketRouter(new TicketController(ticketService), authenticate),
      subscriptions: createSubscriptionRouter(new SubscriptionController(subscriptionService), authenticate),
      notifications: createNotificationRouter(new NotificationController(notificationService), authenticate)
    },
    env.corsOrigin
  );

  app.listen(env.apiPort, () => {
    console.log(`[API] Escuchando en http://localhost:${env.apiPort}/api`);
  });
}

main().catch((error) => {
  console.error('[API] No se pudo iniciar la aplicación', error);
  process.exit(1);
});
