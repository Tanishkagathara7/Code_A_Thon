'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api/domain';
import { AppNotification } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        const res = await notificationsApi.getNotifications(1, 30);
        if (active) {
          setNotifications(res.data || []);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to load notifications';
          toast(msg, 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      active = false;
    };
  }, [toast]);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast('All marked as read', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to mark notifications';
      toast(msg, 'error');
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Notifications</h2>
          <p className="text-sm text-zinc-500">Cross-platform activity alerts and system events</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={markingAll || notifications.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-semibold text-zinc-700">No notifications yet</p>
            <p className="text-xs text-zinc-400">Activity updates from mobile and web will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && handleMarkRead(n._id)}
                className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  n.read ? 'bg-white hover:bg-zinc-50/50' : 'bg-indigo-50/30 hover:bg-indigo-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.read ? 'bg-transparent' : 'bg-indigo-600'
                    }`}
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-900">{n.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] text-zinc-400 block">{formatDate(n.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
