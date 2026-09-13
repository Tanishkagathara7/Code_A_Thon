import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  /**
   * GET /api/notifications
   * Get paginated notifications for authenticated user.
   */
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Session missing.' });
      }

      const rawPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const rawLimit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      if (isNaN(rawPage) || rawPage < 1) {
        return res.status(400).json({ success: false, error: 'Invalid page parameter.' });
      }

      if (isNaN(rawLimit) || rawLimit < 1) {
        return res.status(400).json({ success: false, error: 'Invalid limit parameter.' });
      }

      const result = await NotificationService.getUserNotifications(userId, {
        page: rawPage,
        limit: rawLimit,
      });

      return res.status(200).json({
        success: true,
        data: result.notifications,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to retrieve notifications',
      });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Get total unread count for authenticated user.
   */
  static async getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Session missing.' });
      }

      const count = await NotificationService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to retrieve unread notification count',
      });
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark a specific notification as read.
   */
  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Session missing.' });
      }

      const notificationId = req.params.id as string;
      const updatedNotification = await NotificationService.markAsRead(notificationId, userId);

      return res.status(200).json({
        success: true,
        data: updatedNotification,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 404).json({
        success: false,
        error: error.message || 'Notification not found or access denied',
      });
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Mark all unread notifications as read for authenticated user.
   */
  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. Session missing.' });
      }

      const result = await NotificationService.markAllAsRead(userId);

      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to mark all notifications as read',
      });
    }
  }
}
