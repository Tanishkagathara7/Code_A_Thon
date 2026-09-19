'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Plus, Menu, Search } from 'lucide-react';
import { domainConfig } from '@/lib/domain.config';
import { NotificationPopover } from '@/components/layout/NotificationPopover';

interface TopbarProps {
  unreadCount?: number;
  onMenuClick?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  unreadCount = 0,
  onMenuClick,
  onOpenCommandPalette,
}) => {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname.startsWith('/dashboard')) return { title: 'Command Center', section: 'Operations' };
    if (pathname.startsWith('/items/new')) return { title: 'New Tax Invoice', section: 'GST Billing' };
    if (pathname.startsWith('/items')) return { title: 'Bills & Invoices Ledger', section: 'GST Billing' };
    if (pathname.startsWith('/ai-assistant')) return { title: 'AI Tax Assistant', section: 'Intelligence' };
    if (pathname.startsWith('/files')) return { title: 'Assets & Evidence', section: 'Files & Media' };
    if (pathname.startsWith('/notifications')) return { title: 'Operational Alerts', section: 'Feed' };
    if (pathname.startsWith('/settings')) return { title: 'Settings & Profile', section: 'Account' };
    return { title: 'Workspace', section: 'System' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 bg-white border-b border-[#E6E9F0] px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-[#68728A] hover:text-[#101226] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
          aria-label="Open workspace navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Operational Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-[#68728A]">{breadcrumb.section}</span>
          <span className="text-[#68728A]">/</span>
          <h1 className="font-bold text-[#101226] text-sm tracking-tight">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Center Search Input Trigger */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0] text-[#68728A] hover:text-[#101226] hover:border-zinc-300 hover:bg-white transition-all text-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#68728A]" />
            <span className="truncate text-xs">Search incidents, services, commands...</span>
          </div>
          <div className="flex items-center font-mono text-[10px] text-[#68728A] bg-white px-1.5 py-0.5 rounded border border-[#E6E9F0]">
            <span>Ctrl K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl text-[#68728A] hover:text-[#101226] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Interactive Notification Popover */}
        <NotificationPopover />

        {/* New Bill Primary Action */}
        <Link
          href="/items/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101226] hover:bg-[#1f2445] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Bill</span>
        </Link>
      </div>
    </header>
  );
};
