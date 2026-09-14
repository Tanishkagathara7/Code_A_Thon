import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Highlight } from '@/components/marketing/Highlight';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA]">
      {/* Left Brand Panel: Editorial Bento Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-12 lg:p-16 text-zinc-900 flex-col justify-between relative overflow-hidden border-r border-black/[0.06]">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Identity */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-zinc-950/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                APP
              </span>
            </div>
          </Link>
        </div>

        {/* Narrative & Real Project Asset Context */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-zinc-950">
            AUTHORITATIVE SESSION ON{' '}
            <Highlight variant="blue">WEB</Highlight> AND{' '}
            <Highlight variant="green">MOBILE.</Highlight>
          </h1>

          <p className="text-zinc-600 text-sm leading-relaxed font-normal">
            One shared Express backend, cryptographically secure JWT authentication, and zero latency across React Native Expo and Next.js 14 workspaces.
          </p>

          {/* Real asset framed with bento shadow */}
          <div className="pt-2">
            <div className="relative aspect-[2083/755] w-full rounded-xl border border-black/[0.06] bg-white p-3 shadow-lg shadow-black/[0.04]">
              <Image
                src="/code.png"
                alt="Code-A-Thon Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-contain p-1"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs font-medium text-zinc-500 flex items-center justify-between border-t border-black/[0.06] pt-6">
          <span>© {new Date().getFullYear()} APP Engine</span>
          <div className="flex items-center gap-3">
            <span>Next.js 14</span>
            <span>•</span>
            <span>React Native Expo</span>
          </div>
        </div>
      </div>

      {/* Right Form Area: Clean, Focused Modern Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:w-1/2 bg-[#FAFAFA]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-black/[0.06] shadow-xl shadow-black/[0.04]">
          {children}
        </div>
      </div>
    </div>
  );
}
