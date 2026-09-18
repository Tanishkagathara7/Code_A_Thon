'use client';

import React from 'react';
import Link from 'next/link';
import { domainConfig } from '@/lib/domain.config';

export const MarketingFooter: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={`bg-zinc-50 py-6 sm:py-8 px-4 sm:px-6 text-zinc-700 text-xs font-medium border-t border-black/[0.06] relative z-20 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {domainConfig.brand.shortName ? domainConfig.brand.shortName.charAt(0) : 'A'}
          </div>
          <span className="font-semibold text-zinc-900">{domainConfig.brand.name}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-zinc-950 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-zinc-950 transition-colors">
            Register
          </Link>
          <Link href="/#product" className="hover:text-zinc-950 transition-colors">
            Product
          </Link>
          <Link href="/#architecture" className="hover:text-zinc-950 transition-colors">
            Architecture
          </Link>
          <Link href="/#faq" className="hover:text-zinc-950 transition-colors">
            FAQ
          </Link>
        </div>

        <div className="text-zinc-400 font-mono text-[11px]">
          © {new Date().getFullYear()} {domainConfig.brand.name} • All rights reserved.
        </div>
      </div>
    </footer>
  );
};
