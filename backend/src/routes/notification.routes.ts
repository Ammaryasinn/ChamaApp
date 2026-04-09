import { Router, Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { authMiddleware } from '../middleware/auth';

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);

/**
 * Get all notifications for logged in user
 * GET /api/notifications
 */
notificationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user!.userId);
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
