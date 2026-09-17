import React from 'react';
import { InteractiveGridTiles } from '@/components/auth/InteractiveGridTiles';
import { AuthOrbitalBackground } from '@/components/auth/AuthOrbitalBackground';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Editorial Orbital Background Animation (Orbital Arcs, Floating Multi-Tone Sphere, Parallax & Telemetry Notes) */}
      <AuthOrbitalBackground />

      {/* Interactive Cursor Reactive Grid Tiles Animation */}
      <InteractiveGridTiles tileSize={42} />

      {/* Subtle Ambient Lighting Vignette */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Landing Page Navigation Header */}
      <MarketingNav />

      {/* Main Content Viewport with top padding to account for fixed header */}
      <main className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-6 sm:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16">
        {children}
      </main>

      {/* Landing Page Technical Footer */}
      <MarketingFooter />
    </div>
  );
}
