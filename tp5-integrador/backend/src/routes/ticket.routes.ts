import { RequestHandler, Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authorize } from '../middlewares/authorize';
import { PERMISSIONS } from '../types/permissions';

export function createTicketRouter(controller: TicketController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.TICKET_READ), controller.list);
  router.get('/:id', authorize(PERMISSIONS.TICKET_READ), controller.getById);
  router.post('/', authorize(PERMISSIONS.TICKET_CREATE), controller.create);
  router.put('/:id', authorize(PERMISSIONS.TICKET_UPDATE), controller.update);
  router.patch('/:id/status', authorize(PERMISSIONS.TICKET_CHANGE_STATUS), controller.changeStatus);
  router.delete('/:id', authorize(PERMISSIONS.TICKET_DELETE), controller.delete);

  return router;
}
