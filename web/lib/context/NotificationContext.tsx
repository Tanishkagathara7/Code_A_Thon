'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '@/lib/api/domain';
import { AppNotification } from '@/lib/types';
import { useAuth } from './AuthContext';

export interface NotificationItem extends AppNotification {
  entityId?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<NotificationItem, '_id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getStorageKey = useCallback(() => {
    const userId = user?.id || (user?.isGuest ? 'guest' : 'anonymous');
    return `vyaapar_gst_notifications_${userId}`;
  }, [user]);

  // Load from local storage or server
  const loadInitial = useCallback(async () => {
    setLoading(true);
    const key = getStorageKey();

    try {
      // 1. Try fetching from API if authenticated real user
      if (user && !user.isGuest && user.role !== 'guest') {
        try {
          const res = await notificationsApi.getNotifications(1, 30);
          if (res.data && Array.isArray(res.data)) {
            setNotifications(res.data);
            if (typeof window !== 'undefined') {
              localStorage.setItem(key, JSON.stringify(res.data));
            }
            setLoading(false);
            return;
          }
        } catch {}
      }

      // 2. Check user-scoped localStorage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              setNotifications(parsed);
              setLoading(false);
              return;
            }
          } catch {}
        }
      }

      // 3. New login or no notifications -> clean empty state (no fake data)
      setNotifications([]);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify([]));
      }
    } finally {
      setLoading(false);
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Persist notifications on change
  const saveToStorage = (updated: NotificationItem[]) => {
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      } catch {}
    }
  };

  // Add new notification programmatically (e.g., when a bill is created)
  const addNotification = (newItem: Omit<NotificationItem, '_id' | 'createdAt' | 'read'>) => {
    const created: NotificationItem = {
      ...newItem,
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    saveToStorage([created, ...notifications]);
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    saveToStorage(updated);
    try {
      await notificationsApi.markAsRead(id);
    } catch {}
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveToStorage(updated);
    try {
      await notificationsApi.markAllAsRead();
    } catch {}
  };

  const refreshNotifications = async () => {
    await loadInitial();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
