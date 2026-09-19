'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { domainConfig } from '@/lib/domain.config';

export const MarketingFooter: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={`bg-zinc-50 py-6 sm:py-8 px-4 sm:px-6 text-zinc-700 text-xs font-medium border-t border-black/[0.06] relative z-20 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-200/90 shadow-xs flex items-center justify-center bg-white p-0.5 shrink-0">
            <Image
              src="/icon.png"
              alt="GST Billing Logo"
              width={36}
              height={36}
              className="object-contain w-full h-full scale-110"
            />
          </div>
          <span className="font-bold text-zinc-950 text-sm">{domainConfig.brand.name}</span>
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
