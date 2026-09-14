'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuth } from '@/lib/context/AuthContext';
import { notificationsApi } from '@/lib/api/domain';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      notificationsApi.getUnreadCount()
        .then((count) => setUnreadCount(count))
        .catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-900 animate-spin mb-3" />
        <p className="text-sm font-medium text-zinc-500">Authenticating Pulse session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      <Sidebar unreadNotifications={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar unreadCount={unreadCount} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
