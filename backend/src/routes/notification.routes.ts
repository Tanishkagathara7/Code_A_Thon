import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.use(requireAuth);

router.get('/', NotificationController.getAll);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/read-all', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);

export default router;
