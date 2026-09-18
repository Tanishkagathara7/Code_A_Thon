'use client';

import React, { useRef } from 'react';
import {
  Layers,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const HeroProductShowcase: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ========================================================
          HERO MAIN STAGE: 3D ISOMETRIC TABLET MOCKUP WITH STYLUS
         ======================================================== */}
      <div className="w-full relative py-0 select-none">
        {/* 3D Perspective Stage Container */}
        <div className="tablet-perspective-stage relative max-w-5xl mx-auto pt-2 pb-4 px-2 sm:px-6">
          {/* Playful background decorative shapes matching reference image */}
          <div className="absolute -top-10 -left-12 w-64 h-64 bg-pink-200/40 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="absolute -bottom-8 left-1/4 w-80 h-32 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="absolute top-1/4 -right-10 w-72 h-72 bg-blue-200/40 rounded-full blur-2xl pointer-events-none -z-10" />
          
          {/* 3D Isometric Tablet Body */}
          <div
            ref={stageRef}
            className="tablet-3d-body relative rounded-[2.5rem] bg-[#1E242B] p-3 sm:p-4 border-2 border-zinc-700/60 shadow-2xl transition-transform duration-300 overflow-hidden"
          >
            {/* Tablet Camera Pinhole & Sensor */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700/80" />
              <span className="w-1 h-1 rounded-full bg-blue-900/60" />
            </div>

            {/* Glossy Screen Glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08] pointer-events-none z-20 rounded-[2rem]" />

            {/* Inner Tablet Screen Container */}
            <div className="relative rounded-[2rem] bg-white overflow-hidden shadow-inner flex flex-col min-h-[460px] text-zinc-800">
              
              {/* Tablet Top Navigation Bar */}
              <div className="h-14 bg-white border-b border-zinc-200/80 px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-zinc-900 font-extrabold tracking-tight text-lg">
                    <span className="text-[#1E242B] font-black">Tech</span>
                    <span className="text-zinc-500 font-semibold text-sm">matrix</span>
                  </div>
                  <button className="text-cyan-500 hover:text-cyan-600 p-1 cursor-pointer" aria-label="Menu">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-cyan-50/60 border border-cyan-100 text-xs font-semibold text-cyan-800">
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                      TM
                    </div>
                    <span className="hidden sm:inline font-medium">tripMatrix</span>
                  </div>
                </div>
              </div>

              {/* Tablet Two-Column Layout (Sidebar + Main Data Tables) */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* Left Mini Sidebar */}
                <div className="w-40 sm:w-48 bg-zinc-50/70 border-r border-zinc-200/80 p-3 sm:p-4 flex flex-col justify-between hidden sm:flex">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-700 font-semibold text-xs border border-cyan-200/60 shadow-xs">
                      <Layers className="w-4 h-4 text-cyan-600" />
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span>Inquiry</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors">
                      <TrendingUp className="w-4 h-4 text-zinc-400" />
                      <span>Tracking</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        <span>Manage</span>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">›</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors">
                      <Zap className="w-4 h-4 text-zinc-400" />
                      <span>Setting</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 text-xs text-zinc-500">
                    <div className="font-semibold text-zinc-800">Status</div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Inquiries Active
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-x-auto bg-white">
                  
                  {/* Dashboard Header Bar (Using div with presentation semantics to not disrupt page H1->H2 outline) */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <div>
                      <div className="text-base font-bold tracking-tight text-zinc-900" role="presentation">
                        Operational Dashboard
                      </div>
                      <div className="text-xs text-zinc-500 font-medium">Real-Time Inquiry Telemetry</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded-md tabular-nums">
                        16-07-2026 05:03 pm
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Cards (Spacious & High Readability) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/70">
                      <div className="text-xs text-cyan-800 font-semibold">Active Inquiries</div>
                      <div className="text-xl font-bold text-cyan-950 mt-1">24 Received</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                      <div className="text-xs text-emerald-800 font-semibold">Sync Status</div>
                      <div className="text-xl font-bold text-emerald-950 mt-1">100% In Sync</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-200/70">
                      <div className="text-xs text-violet-800 font-semibold">Avg Response</div>
                      <div className="text-xl font-bold text-violet-950 mt-1">&lt; 38ms</div>
                    </div>
                  </div>

                  {/* Focused Table Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-zinc-800 text-sm">Recent Live Inquiries</div>
                      <span className="text-xs text-zinc-500">Showing 2 of 24 records</span>
                    </div>

                    <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs" aria-label="Recent Inquiries Preview">
                          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                            <tr>
                              <th className="px-4 py-3">Inquiry ID</th>
                              <th className="px-4 py-3">Customer</th>
                              <th className="px-4 py-3">Destination</th>
                              <th className="px-4 py-3">Handled By</th>
                              <th className="px-4 py-3">Timestamp</th>
                              <th className="px-4 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-700">
                            <tr className="hover:bg-zinc-50/60 transition-colors">
                              <td className="px-4 py-3 font-mono font-medium text-zinc-900">INQ-001</td>
                              <td className="px-4 py-3 font-medium text-zinc-800">Mr. Alice</td>
                              <td className="px-4 py-3">Thailand</td>
                              <td className="px-4 py-3">Mr. John</td>
                              <td className="px-4 py-3 font-mono text-xs tabular-nums text-zinc-600">
                                16-07-2026 05:03 pm
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                  New
                                </span>
                              </td>
                            </tr>
                            <tr className="hover:bg-zinc-50/60 transition-colors">
                              <td className="px-4 py-3 font-mono font-medium text-zinc-900">INQ-002</td>
                              <td className="px-4 py-3 font-medium text-zinc-800">Mr. Mike</td>
                              <td className="px-4 py-3">Thailand</td>
                              <td className="px-4 py-3">Mr. John</td>
                              <td className="px-4 py-3 font-mono text-xs tabular-nums text-zinc-600">
                                16-07-2026 05:03 pm
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  In Progress
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
