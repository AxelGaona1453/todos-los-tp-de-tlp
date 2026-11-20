import { RequestHandler, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authorize } from '../middlewares/authorize';
import { PERMISSIONS } from '../types/permissions';

export function createUserRouter(controller: UserController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);

  router.get('/', authorize(PERMISSIONS.USER_READ), controller.list);
  router.get('/roles', authorize(PERMISSIONS.USER_ASSIGN_ROLE), controller.listRoles);
  router.patch('/:id/role', authorize(PERMISSIONS.USER_ASSIGN_ROLE), controller.assignRole);

  return router;
}
