import { RequestHandler, Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { authorize } from '../middlewares/authorize';
import { PERMISSIONS } from '../types/permissions';

export function createSubscriptionRouter(controller: SubscriptionController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.TICKET_READ), controller.listMine);
  router.post('/', authorize(PERMISSIONS.SUBSCRIPTION_CREATE), controller.subscribe);
  router.delete('/:ticketId', authorize(PERMISSIONS.SUBSCRIPTION_DELETE), controller.unsubscribe);

  return router;
}
