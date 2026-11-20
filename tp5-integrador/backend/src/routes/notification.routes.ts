import { RequestHandler, Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authorize } from '../middlewares/authorize';
import { PERMISSIONS } from '../types/permissions';

export function createNotificationRouter(controller: NotificationController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate, authorize(PERMISSIONS.NOTIFICATION_READ));

  router.get('/', controller.list);
  router.get('/unread-count', controller.unreadCount);
  router.patch('/read-all', controller.markAllAsRead);
  router.patch('/:id/read', controller.markAsRead);

  return router;
}
