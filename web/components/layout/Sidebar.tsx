'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  FolderOpen,
  Activity,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Search,
  LogOut,
  X,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  unreadNotifications?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  unreadNotifications,
  isOpen = false,
  onClose,
  onOpenCommandPalette,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount: contextUnreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  const effectiveUnread = unreadNotifications !== undefined ? unreadNotifications : contextUnreadCount;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Bill', href: '/items/new', icon: Sparkles },
    { name: 'Bills & Invoices', href: '/items', icon: Layers },
    { name: 'AI Tax Assistant', href: '/ai-assistant', icon: Bot },
    { name: 'Sales Analytics', href: '/dashboard/analytics', icon: Activity },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: effectiveUnread > 0 ? effectiveUnread : undefined },
    { name: 'Settings & Profile', href: '/settings', icon: Settings },
  ];

  const userRole = user?.role || 'operator';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'bg-[#FAFCFF] border-r border-[#EEF2F6] flex flex-col justify-between h-screen fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out select-none lg:static lg:translate-x-0 relative overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-[270px]',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Scrollable Upper Area */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative z-10 no-scrollbar">
          {/* Header (aligned with Topbar h-16) */}
          <div
            className={cn(
              'h-16 flex items-center border-b border-[#EEF2F6]',
              collapsed
                ? 'justify-center px-2'
                : 'justify-between px-5 sm:px-6'
            )}
          >
            <Link
              href="/dashboard"
              onClick={onClose}
              className={cn(
                'flex items-center group',
                collapsed ? 'justify-center' : 'gap-3.5 min-w-0'
              )}
            >
              {/* GST Billing Brand Logo */}
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-xs border border-black/[0.08] bg-white p-0.5">
                <Image
                  src="/icon.png"
                  alt="GST Billing Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full scale-110"
                  priority
                />
              </div>

              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-extrabold text-[18px] tracking-tight text-[#161828] leading-none">
                    GST Billing
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.06em] text-[#8C95A6] mt-1 uppercase">
                    BILLING & POS SUITE
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse toggle (only when expanded, in collapsed it appears below in clean bar or toggle) */}
            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-[#F0F3F8] hover:bg-[#E5EAF2] text-[#8690A2] hover:text-[#161828] transition-colors cursor-pointer flex-shrink-0"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#8690A2] hover:text-zinc-900 hover:bg-[#F0F3F8] cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collapsed expand button */}
          {collapsed && (
            <div className="pt-3 pb-1 flex justify-center">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="w-10 h-8 flex items-center justify-center rounded-xl bg-[#F0F3F8] hover:bg-[#E5EAF2] text-[#8690A2] hover:text-[#161828] transition-all cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Trigger */}
          {!collapsed ? (
            <div className="px-5 pb-3">
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="w-full h-11 flex items-center justify-between gap-2 px-3.5 rounded-2xl bg-white border border-[#E8ECF2] text-[#8E98A8] hover:border-[#D3DAE6] transition-all group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] whitespace-nowrap overflow-hidden"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Search className="w-4 h-4 text-[#9AA3B4] group-hover:text-[#5C4CF6] transition-colors shrink-0" />
                  <span className="text-[12.5px] font-normal text-[#8A94A6] truncate">
                    Search navigation...
                  </span>
                </div>
                <kbd className="shrink-0 text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-[#F4F6FA] border border-[#E3E7EE] text-[#788294] leading-tight select-none">
                  Ctrl K
                </kbd>
              </button>
            </div>
          ) : (
            <div className="px-3 pb-3 flex justify-center">
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E8ECF2] text-[#8E98A8] hover:text-[#5C4CF6] hover:border-[#D3DAE6] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                title="Search navigation (Ctrl K)"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* WORKSPACE Category Title */}
          {!collapsed && (
            <div className="px-6 pt-4 pb-2 text-[10px] font-bold text-[#8E98A8] uppercase tracking-wider">
              WORKSPACE
            </div>
          )}

          {/* Navigation Items */}
          <nav className={cn('space-y-2', collapsed ? 'px-3 pt-2' : 'px-4 pt-1')}>
            {navigation.map((item) => {
              const isActive =
                item.name === 'Dashboard'
                  ? pathname === '/dashboard' || pathname === '/'
                  : pathname === item.href;

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    'flex items-center transition-all duration-150 group relative select-none',
                    collapsed
                      ? 'justify-center w-11 h-11 mx-auto rounded-xl'
                      : 'justify-between px-4 py-3 rounded-2xl text-[13.5px]',
                    isActive
                      ? 'bg-[#0E1025] text-white shadow-[0_2px_8px_rgba(14,16,37,0.18)]'
                      : 'text-[#626E82] hover:text-[#161828] hover:bg-[#F2F5FA]'
                  )}
                >
                  <div className={cn('flex items-center min-w-0', collapsed ? 'justify-center' : 'gap-3.5')}>
                    <Icon
                      className={cn(
                        'w-[18px] h-[18px] transition-colors flex-shrink-0',
                        isActive
                          ? 'text-[#6D5AFB]'
                          : 'text-[#7B8699] group-hover:text-[#161828]'
                      )}
                    />
                    {!collapsed && (
                      <span className={cn('tracking-tight truncate', isActive ? 'font-semibold' : 'font-medium')}>
                        {item.name}
                      </span>
                    )}
                  </div>

                  {/* Badge */}
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        'min-w-5 h-5 px-1.5 flex items-center justify-center text-[11px] font-bold rounded-full flex-shrink-0',
                        isActive
                          ? 'bg-[#5C4CF6] text-white'
                          : 'bg-[#EDE8FF] text-[#5C4CF6]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {collapsed && item.badge && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#5C4CF6] ring-2 ring-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Ambient Decorative Graphic — Perfectly balanced in the empty space */}
        {!collapsed && (
          <div className="absolute inset-x-0 bottom-16 pointer-events-none select-none z-0 overflow-hidden h-[210px]">
            <svg
              className="absolute -left-12 -bottom-4 w-80 h-80 opacity-75"
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="90" cy="210" r="75" fill="#5C4CF6" fillOpacity="0.03" />
              <circle cx="90" cy="210" r="115" stroke="#5C4CF6" strokeWidth="1.2" strokeOpacity="0.12" />
              <circle cx="90" cy="210" r="165" stroke="#5C4CF6" strokeWidth="1" strokeOpacity="0.07" />

              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={180 + c * 10}
                    cy={150 + r * 10}
                    r="1.2"
                    fill="#6366F1"
                    fillOpacity="0.14"
                  />
                ))
              )}
            </svg>

            {/* Motivational motto */}
            <div className="absolute bottom-4 right-7 text-right flex flex-col items-end opacity-90">
              <span className="text-[10px] font-semibold text-[#8692A6] leading-[1.35]">Monitor</span>
              <span className="text-[10px] font-semibold text-[#8692A6] leading-[1.35]">Respond</span>
              <span className="text-[10px] font-semibold text-[#8692A6] leading-[1.35]">Resolve</span>
              <span className="text-[10px] font-semibold text-[#8692A6] leading-[1.35]">Together</span>
              <div className="w-7 h-[1.5px] bg-[#CFD6E2] mt-1.5 rounded-full" />
            </div>
          </div>
        )}

        {/* Footer Area: User Profile & Logout */}
        <div className="p-3 border-t border-[#EEF2F6] bg-[#FAFCFF] relative z-10">

          {/* User Profile Card & Sign Out */}
          {!collapsed ? (
            <div className="pt-1 flex items-center justify-between gap-2 px-1">
              <Link
                href="/settings"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity cursor-pointer group"
                title="Open Settings & Profile"
              >
                <div className="w-8 h-8 rounded-full bg-[#EDE8FF] border border-[#DDD6FE] text-[#5C4CF6] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#161828] truncate leading-tight group-hover:text-indigo-600 transition-colors">
                      {user?.name || 'Operator'}
                    </p>
                    {user?.isGuest && (
                      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                        GUEST
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8692A6] truncate leading-tight mt-0.5">
                    {user?.isGuest ? 'Browsing in guest mode' : (user?.email || 'operator@pulse.io')}
                  </p>
                </div>
              </Link>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#8692A6] hover:text-[#EF4444] hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer flex-shrink-0"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-1">
              <Link
                href="/settings"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#EDE8FF] border border-[#DDD6FE] text-[#5C4CF6] flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-105 transition-transform"
                title={`Settings & Profile: ${user?.name || 'Operator'} (${user?.email || 'operator@pulse.io'})`}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#8692A6] hover:text-[#EF4444] hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
