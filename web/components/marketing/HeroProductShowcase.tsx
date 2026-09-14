'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Smartphone,
  X,
  ExternalLink,
  Activity,
  ShieldCheck,
  Zap,
  Terminal,
} from 'lucide-react';
import { pauseLenis, resumeLenis } from '@/lib/animations/lenis';

interface HeroProductShowcaseProps {
  isPreviewOpen: boolean;
  onOpenPreview: () => void;
  onClosePreview: () => void;
}

export const HeroProductShowcase: React.FC<HeroProductShowcaseProps> = ({
  isPreviewOpen,
  onOpenPreview,
  onClosePreview,
}) => {
  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Synchronize Lenis and Body Scroll Lock when preview modal opens/closes
  useEffect(() => {
    if (isPreviewOpen) {
      pauseLenis();
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClosePreview();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // GSAP animate preview opening
      if (modalBackdropRef.current && modalWindowRef.current) {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isReduced) {
          gsap.set(modalBackdropRef.current, { opacity: 1 });
          gsap.set(modalWindowRef.current, { opacity: 1, scale: 1, y: 0 });
        } else {
          gsap.fromTo(
            modalBackdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
          );
          gsap.fromTo(
            modalWindowRef.current,
            { scale: 0.94, y: 24, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
          );
        }
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        resumeLenis();
        document.body.style.overflow = '';
      };
    } else {
      resumeLenis();
      document.body.style.overflow = '';
    }
  }, [isPreviewOpen, onClosePreview]);

  const handleClose = () => {
    if (modalBackdropRef.current && modalWindowRef.current) {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        onClosePreview();
      } else {
        gsap.to(modalWindowRef.current, {
          scale: 0.96,
          y: 12,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        });
        gsap.to(modalBackdropRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            onClosePreview();
          },
        });
      }
    } else {
      onClosePreview();
    }
  };

  return (
    <>
      {/* ========================================================
          HERO MAIN STAGE: CINEMATIC BENTO PRODUCT COMPOSITION
         ======================================================== */}
      <div className="w-full relative mt-10 select-none">
        {/* Floating telemetry pills */}
        <div className="flex items-center justify-between px-2 mb-3 text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold text-zinc-800">Operational Workspace Engine</span>
            <span className="text-zinc-400">•</span>
            <span className="font-mono text-[11px] text-zinc-400">REST v1.4.0</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-medium border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ATLAS CLOUD SYNCED
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 text-amber-500" /> 32ms RTT
            </span>
          </div>
        </div>

        {/* Premium Window Frame */}
        <div
          ref={stageRef}
          onClick={onOpenPreview}
          className="group relative cursor-pointer rounded-2xl bg-white border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_48px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_28px_64px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenPreview();
            }
          }}
          aria-label="Click to inspect full-page web operations workspace preview"
        >
          {/* Subtle top glare highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />

          {/* Floating Hover Indicator */}
          <div className="absolute top-14 right-6 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel text-zinc-900 text-xs font-semibold shadow-lg shadow-black/5 border border-black/10">
              <span>Inspect Live Stage</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            </span>
          </div>

          {/* Realistic Window Titlebar */}
          <div className="h-11 bg-zinc-50/80 border-b border-black/[0.06] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
              <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 border border-black/[0.05] text-[11px] font-medium text-zinc-600">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>app.workspace.internal/operations</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <span className="hidden md:inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200/80">
                PORT 3000
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>

          {/* Product Interior View */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-zinc-50/50 space-y-6 text-left">
            {/* Bento Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/[0.1] transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Domain Items</span>
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-2">24</div>
                <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
                  <span className="text-emerald-600 font-semibold">↑ 100%</span> synchronized
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/[0.1] transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Completed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 mt-2">18</div>
                <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Production ready
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/[0.1] transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>In Flight</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600 mt-2">6</div>
                <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Active mutations
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-sm hover:border-black/[0.1] transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Parity Rate</span>
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-2">75%</div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1 font-mono">
                  Bi-directional
                </div>
              </div>
            </div>

            {/* Asymmetric Bento Body: Table + Live Companion Mobile Mock */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Operations Pipeline Table */}
              <div className="lg:col-span-8 rounded-xl bg-white border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="bg-zinc-50 px-5 py-3 border-b border-black/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Real-Time Operations Pipeline</span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">SORT: PRIORITY // DESC</span>
                </div>
                <div className="divide-y divide-black/[0.05] text-xs">
                  <div className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">
                        Cross-Platform State Verification
                      </div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">
                        Category: Engineering • JWT Bearer Auth Handshake
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        COMPLETED
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">
                        Expo Router v57 Bundle Optimization
                      </div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">
                        Category: Mobile • Native Gesture & Biometrics
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        IN PROGRESS
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">
                        OpenRouter LLM Entity Summarization
                      </div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">
                        Category: AI Engine • Automated Action Plans
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        SYNTHESIZED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Native Mobile Companion Bento Card */}
              <div className="lg:col-span-4 rounded-xl bg-zinc-950 text-white p-5 space-y-4 shadow-md border border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Mobile Companion Client</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    EXPO SDK 57
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                    <div className="text-zinc-400 text-[11px]">Hardware Biometrics</div>
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FaceID / Fingerprint Ready
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
                    <div className="text-zinc-400 text-[11px]">Cache Invalidation</div>
                    <div className="font-mono text-zinc-200 text-[11px]">
                      Triggered in &lt; 35ms via Express Core
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
                  >
                    <span>Open Live Operations</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL-PAGE INTERACTIVE PREVIEW MODAL
         ======================================================== */}
      {isPreviewOpen && (
        <div
          ref={modalBackdropRef}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalWindowRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-white rounded-2xl border border-black/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="h-12 bg-zinc-50 border-b border-black/[0.06] px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-900 text-sm">Interactive Product Workspace</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  LIVE SIMULATION
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="btn-primary px-3 py-1.5 text-xs font-semibold"
                >
                  <span>Go to App</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Link>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Synchronized High-Density Dashboard</h3>
                <p className="text-sm text-zinc-600 max-w-2xl">
                  Inspect domain items, execute instant status updates, and orchestrate automated AI workflows directly across desktop and mobile clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500">API Endpoint</div>
                  <div className="font-bold text-zinc-900 mt-1">GET /api/analytics/overview</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500">State Architecture</div>
                  <div className="font-bold text-zinc-900 mt-1">Context + SecureStore</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500">AI Gateway</div>
                  <div className="font-bold text-zinc-900 mt-1">OpenRouter / auto</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-950 text-white font-mono text-xs space-y-2">
                <div className="text-zinc-400">// System verification output</div>
                <div className="text-emerald-400">✓ Cryptographic token integrity confirmed</div>
                <div className="text-blue-400">✓ React 19 hydration completed without drift</div>
                <div className="text-zinc-300">✓ Native bridge established with Expo SDK 57</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
