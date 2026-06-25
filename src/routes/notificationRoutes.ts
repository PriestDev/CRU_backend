import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/:id/read', authMiddleware, markNotificationAsRead);
router.put('/read-all', authMiddleware, markAllNotificationsAsRead);

export default router;
