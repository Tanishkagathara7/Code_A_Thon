'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { PulseBackgroundSystem } from '@/components/background/PulseBackgroundSystem';
import { useAuth } from '@/lib/context/AuthContext';
import { notificationsApi } from '@/lib/api/domain';
import { Loader2 } from 'lucide-react';

export default function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      notificationsApi
        .getUnreadCount()
        .then((count) => setUnreadCount(count))
        .catch(() => {});
    }
  }, [user]);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0A0A0A] animate-spin mb-3" />
        <p className="text-sm font-medium text-[#687080]">Authenticating Pulse Command session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F8F9FC] text-[#101226] selection:bg-[#5B45F5]/15 selection:text-[#5B45F5] relative">
      <Sidebar
        unreadNotifications={unreadCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <Topbar
          unreadCount={unreadCount}
          onMenuClick={() => setSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-7 max-w-[1680px] w-full min-w-0">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
