import { apiClient } from './apiClient';
import {
  AppNotification,
  PaginatedNotifications,
  UnreadCountData,
} from '../../types/notification';
import { storage } from '../../context/AuthContext';

export const NOTIFICATIONS_CACHE_KEY = 'mindbloom_cached_notifications';
export const UNREAD_COUNT_CACHE_KEY = 'mindbloom_cached_unread_count';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: any;
  message?: string;
  error?: string;
}

export const notificationApi = {
  /**
   * Fetch paginated notifications for the current authenticated user and update cache.
   */
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedNotifications> {
    const response = await apiClient.get<ApiResponse<AppNotification[]>>('/notifications', {
      page,
      limit,
    });

    if (response.success && response.data) {
      const paginatedData: PaginatedNotifications = {
        notifications: response.data,
        pagination: response.pagination || {
          page,
          limit,
          total: response.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

      if (page === 1) {
        storage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(paginatedData)).catch(() => {});
      }
      return paginatedData;
    }
    throw new Error(response.error || 'Failed to fetch notifications');
  },

  /**
   * Get total unread count for current user and update cache.
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<UnreadCountData>>('/notifications/unread-count');
    if (response.success && response.data) {
      const count = response.data.count ?? 0;
      storage.setItem(UNREAD_COUNT_CACHE_KEY, String(count)).catch(() => {});
      return count;
    }
    throw new Error(response.error || 'Failed to fetch unread count');
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id: string): Promise<AppNotification> {
    const response = await apiClient.patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to mark notification as read');
  },

  /**
   * Mark all unread notifications as read.
   */
  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    const response = await apiClient.patch<ApiResponse<{ modifiedCount: number }>>('/notifications/read-all');
    if (response.success && response.data) {
      storage.setItem(UNREAD_COUNT_CACHE_KEY, '0').catch(() => {});
      return response.data;
    }
    throw new Error(response.error || 'Failed to mark all as read');
  },

  /**
   * Get cached notifications for offline display.
   */
  async getCachedNotifications(): Promise<PaginatedNotifications | null> {
    try {
      const cached = await storage.getItem(NOTIFICATIONS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as PaginatedNotifications;
      }
    } catch {}
    return null;
  },

  /**
   * Get cached unread count for offline display.
   */
  async getCachedUnreadCount(): Promise<number> {
    try {
      const cached = await storage.getItem(UNREAD_COUNT_CACHE_KEY);
      if (cached !== null) {
        return parseInt(cached, 10) || 0;
      }
    } catch {}
    return 0;
  },
};
