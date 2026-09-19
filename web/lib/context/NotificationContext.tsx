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

const LOCAL_STORAGE_KEY = 'vyaapar_gst_notifications';

const DEFAULT_GST_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: 'notif_init_1',
    recipient: 'retailer',
    type: 'invoice_generated',
    title: 'Tax Invoice Generated: INV-2026-0042',
    message: 'Rajesh Traders (Gujarat) billed for ₹7,665.00 with CGST 2.5% + SGST 2.5%. Tax invoice ready for print.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    entityId: 'INV-2026-0042',
  },
  {
    _id: 'notif_init_2',
    recipient: 'retailer',
    type: 'payment_received',
    title: 'Payment Received: ₹44,100.00',
    message: 'Shreeji Electronics cleared outstanding dues for INV-2026-0043 via UPI settlement. Account marked Paid.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    entityId: 'INV-2026-0043',
  },
  {
    _id: 'notif_init_3',
    recipient: 'retailer',
    type: 'tax_rule',
    title: 'Inter-State Supply Auto-Routed (IGST)',
    message: 'Billed to Mumbai Textile Syndicate. System auto-routed 100% tax liability to Integrated GST (12%).',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    entityId: 'INV-2026-0044',
  },
  {
    _id: 'notif_init_4',
    recipient: 'retailer',
    type: 'compliance',
    title: 'GSTR-1 Monthly Outward Summary Ready',
    message: 'Monthly sales and HSN tax breakup compiled for current FY period. Total GST collected: ₹16,840.00.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load from local storage or server
  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      // Check localStorage first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setNotifications(parsed);
              setLoading(false);
              return;
            }
          } catch {}
        }
      }

      // Try fetching from API if user is authenticated
      if (user) {
        try {
          const res = await notificationsApi.getNotifications(1, 30);
          if (res.data && res.data.length > 0) {
            setNotifications(res.data);
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
            }
            setLoading(false);
            return;
          }
        } catch {}
      }

      // Fallback to rich GST sample notifications
      setNotifications(DEFAULT_GST_NOTIFICATIONS);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GST_NOTIFICATIONS));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Persist notifications on change
  const saveToStorage = (updated: NotificationItem[]) => {
    setNotifications(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
