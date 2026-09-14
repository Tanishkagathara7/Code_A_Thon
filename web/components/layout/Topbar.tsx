'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Plus } from 'lucide-react';

interface TopbarProps {
  unreadCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({ unreadCount = 0 }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Analytics';
    if (pathname.startsWith('/items/new')) return 'Create New Item';
    if (pathname.startsWith('/items')) return 'Items Operations';
    if (pathname.startsWith('/ai-assistant')) return 'AI Intelligence Assistant';
    if (pathname.startsWith('/files')) return 'Storage & Asset Manager';
    if (pathname.startsWith('/notifications')) return 'Notification Feed';
    return 'Workspace';
  };

  return (
    <header className="h-16 glass-panel border-b border-black/[0.06] px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-zinc-900 tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Rapid Actions */}
        <Link
          href="/items/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-primary text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Item</span>
        </Link>

        {/* Notification Icon */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </Link>

        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-zinc-500">API Connected</span>
        </div>
      </div>
    </header>
  );
};
