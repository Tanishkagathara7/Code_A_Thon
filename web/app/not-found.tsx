import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found — 404',
  description: 'The requested page could not be located on the APP platform.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between px-4 sm:px-6 py-12 select-none">
      {/* Top Bar Brand */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:bg-zinc-800 transition-colors">
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-950">
            APP
          </span>
        </Link>
        <span className="font-mono text-xs text-zinc-400">STATUS // 404</span>
      </div>

      {/* Center 404 Bento Card */}
      <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-semibold shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>RESOURCE NOT LOCATED</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950">
          404 — Not Found
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md mx-auto">
          The requested endpoint or operational view does not exist or has been relocated to another workspace node.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sign In to Workspace</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs font-mono text-zinc-400 border-t border-black/[0.05] pt-6">
        APP CROSS-PLATFORM OPERATIONAL ARCHITECTURE
      </div>
    </div>
  );
}
