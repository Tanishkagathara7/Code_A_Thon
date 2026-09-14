'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  FolderOpen,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  unreadNotifications?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ unreadNotifications = 0 }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Items Hub', href: '/items', icon: Layers },
    { name: 'AI Copilot', href: '/ai-assistant', icon: Sparkles },
    { name: 'File Storage', href: '/files', icon: FolderOpen },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/[0.06] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Top Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-black/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-white shadow-sm font-sans text-xs group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-zinc-900">APP</span>
              <span className="ml-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-700'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-semibold rounded-full',
                      isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Bottom Box */}
      <div className="p-4 border-t border-black/[0.06]">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-semibold text-zinc-700 text-xs flex-shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4 text-zinc-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">{user?.name || 'Workspace Operator'}</p>
            <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'operator@workspace.app'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3 h-3 text-rose-400" />
        </button>
      </div>
    </aside>
  );
};
