import mongoose from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/Notification';

export interface CreateNotificationInput {
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedNotificationsResponse {
  notifications: INotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class NotificationService {
  /**
   * Create a new notification for a specific recipient user.
   */
  static async createNotification(input: CreateNotificationInput): Promise<INotification> {
    if (!input.recipient || !mongoose.Types.ObjectId.isValid(input.recipient)) {
      throw new Error('Valid recipient User ID is required');
    }

    const notification = new Notification({
      recipient: new mongoose.Types.ObjectId(input.recipient),
      type: input.type,
      title: input.title,
      message: input.message,
      read: false,
      data: input.data || {},
    });

    return await notification.save();
  }

  /**
   * Get paginated notifications for the authenticated user, newest first.
   */
  static async getUserNotifications(
    userId: string,
    options: GetNotificationsOptions = {}
  ): Promise<PaginatedNotificationsResponse> {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Valid User ID is required');
    }

    const page = Math.max(1, Number(options.page) || 1);
    const rawLimit = Number(options.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;

    const filter = {
      recipient: new mongoose.Types.ObjectId(userId),
    };

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Notification.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get the total unread notification count for the authenticated user.
   */
  static async getUnreadCount(userId: string): Promise<number> {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Valid User ID is required');
    }

    return await Notification.countDocuments({
      recipient: new mongoose.Types.ObjectId(userId),
      read: false,
    }).exec();
  }

  /**
   * Mark a single notification as read, enforcing recipient user ownership.
   */
  static async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      const err = new Error('Notification not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Valid User ID is required');
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: new mongoose.Types.ObjectId(userId),
      },
      { $set: { read: true } },
      { new: true }
    ).exec();

    if (!notification) {
      const err = new Error('Notification not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return notification;
  }

  /**
   * Mark all unread notifications as read for the authenticated user.
   */
  static async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Valid User ID is required');
    }

    const result = await Notification.updateMany(
      {
        recipient: new mongoose.Types.ObjectId(userId),
        read: false,
      },
      { $set: { read: true } }
    ).exec();

    return { modifiedCount: result.modifiedCount };
  }
}
