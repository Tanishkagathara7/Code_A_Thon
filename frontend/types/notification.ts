export type NotificationType =
  | 'ITEM_CREATED'
  | 'ITEM_UPDATED'
  | 'ITEM_COMPLETED'
  | 'AI_COMPLETED'
  | 'SYSTEM';

export interface NotificationData {
  entityId?: string;
  entityType?: string;
  [key: string]: any;
}

export interface AppNotification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: NotificationData;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotifications {
  notifications: AppNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountData {
  count: number;
}
