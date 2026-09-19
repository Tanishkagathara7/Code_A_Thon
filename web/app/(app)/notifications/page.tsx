'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Loader2,
  FileText,
  DollarSign,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';
import { useNotifications } from '@/lib/context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    toast('All notifications marked as read', 'success');
    setMarkingAll(false);
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'invoice_generated':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'tax_rule':
      case 'compliance':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Billing Alerts & Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            Real-time billing dispatches, statutory GST updates, and payment reconciliation logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Unread Filter Toggle */}
          <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl text-xs font-semibold shadow-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
            <span>Loading billing alerts...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Bell className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-semibold text-zinc-800">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications recorded yet'}
            </p>
            <p className="text-xs text-zinc-400">
              New tax invoice dispatches and counter payments will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && handleMarkRead(n._id)}
                className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  n.read ? 'bg-white hover:bg-zinc-50/60' : 'bg-emerald-50/25 hover:bg-emerald-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    n.read ? 'bg-zinc-50 border-zinc-200' : 'bg-white border-emerald-200 shadow-xs'
                  }`}>
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-950 truncate">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-zinc-400 block pt-0.5 font-mono">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {!n.read ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n._id);
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400">Read</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
