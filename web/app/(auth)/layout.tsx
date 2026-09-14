import React from 'react';
import Link from 'next/link';
import { InteractiveGridTiles } from '@/components/auth/InteractiveGridTiles';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Interactive Cursor Reactive Grid Tiles Animation */}
      <InteractiveGridTiles tileSize={42} />

      {/* Subtle Ambient Lighting Vignette */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Brand Header Navigation */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Compact Premium Wordmark */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:bg-zinc-800 transition-colors">
            A
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-zinc-950">
              APP
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              ENGINE
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content Viewport */}
      <main className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Technical Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-black/[0.05] gap-2">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} APP ENGINE ARCHITECTURE</span>
          <span className="hidden sm:inline text-zinc-300">•</span>
          <span className="hidden sm:inline">END-TO-END VERIFIED</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <span>NEXT.js 14 APP ROUTER</span>
          <span>•</span>
          <span>REACT NATIVE EXPO 0.81</span>
        </div>
      </footer>
    </div>
  );
}
