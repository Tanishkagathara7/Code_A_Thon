'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, ExternalLink, FileText, DollarSign, ShieldCheck, Info, X } from 'lucide-react';
import { useNotifications } from '@/lib/context/NotificationContext';
import { formatDate } from '@/lib/utils';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'invoice_generated':
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case 'payment_received':
        return <DollarSign className="w-3.5 h-3.5 text-blue-600" />;
      case 'tax_rule':
      case 'compliance':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  const previewNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 transition-all cursor-pointer border border-transparent hover:border-zinc-200"
        title="Billing Alerts"
        aria-label="Billing Notifications"
      >
        <Bell className="w-[18px] h-[18px] text-zinc-700 transition-transform active:scale-95" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs select-none pointer-events-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-zinc-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-[#FAFAF8]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900">Billing Alerts</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {unreadCount} new
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-semibold text-zinc-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors p-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List Feed */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
            {previewNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-1 text-zinc-500">
                <Bell className="w-6 h-6 mx-auto text-zinc-300" />
                <p className="text-xs font-semibold text-zinc-700">No alerts yet</p>
                <p className="text-[11px] text-zinc-400">
                  Tax invoice dispatches and payment alerts will pop up here.
                </p>
              </div>
            ) : (
              previewNotifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => !item.read && markAsRead(item._id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    item.read ? 'bg-white hover:bg-zinc-50/70' : 'bg-emerald-50/30 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${
                    item.read ? 'bg-zinc-50 border-zinc-200' : 'bg-white border-emerald-200 shadow-2xs'
                  }`}>
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11.5px] text-zinc-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono pt-0.5">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-2.5 bg-[#FAFAF8] border-t border-zinc-100 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-zinc-900 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Notifications</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
