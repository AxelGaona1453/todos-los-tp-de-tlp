import cors from 'cors';
import express, { Express, Router } from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

export interface AppRouters {
  auth: Router;
  users: Router;
  tickets: Router;
  subscriptions: Router;
  notifications: Router;
}

/** Arma la app de Express con los routers ya construidos en main.ts. */
export function createApp(routers: AppRouters, corsOrigin: string): Express {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', routers.auth);
  app.use('/api/users', routers.users);
  app.use('/api/tickets', routers.tickets);
  app.use('/api/subscriptions', routers.subscriptions);
  app.use('/api/notifications', routers.notifications);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
