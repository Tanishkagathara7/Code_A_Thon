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
      <div className="w-full relative py-2 sm:py-6 select-none">
        {/* 3D Perspective Stage Container */}
        <div className="tablet-perspective-stage relative max-w-5xl mx-auto py-8 px-2 sm:px-6">
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
                      <span className="text-[10px] text-zinc-400 font-mono">›</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors">
                      <Zap className="w-4 h-4 text-zinc-400" />
                      <span>Setting</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 text-[10px] text-zinc-500">
                    <div className="font-semibold text-zinc-800">Status</div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Inquiries Active
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-x-auto bg-white">
                  
                  {/* Dashboard Page Title */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900">Dashboard</h3>
                    <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                      16-07-2026
                    </span>
                  </div>

                  {/* Section 1: New Inquiry Table */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-zinc-800 text-sm">New Inquiry</h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span>Show</span>
                        <span className="px-1.5 py-0.5 border border-zinc-200 rounded bg-zinc-50 font-medium">10</span>
                        <span>entries</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>Search:</span>
                        <input
                          type="text"
                          readOnly
                          placeholder=""
                          className="w-24 sm:w-32 px-2 py-0.5 border border-zinc-200 rounded bg-zinc-50 text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Styled Table 1 */}
                    <div className="rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="px-3 py-2">Inquiry No</th>
                              <th className="px-3 py-2">Customer</th>
                              <th className="px-3 py-2">Destination</th>
                              <th className="px-3 py-2">Travel Date</th>
                              <th className="px-3 py-2">Persons</th>
                              <th className="px-3 py-2">Rooms</th>
                              <th className="px-3 py-2">Handled By</th>
                              <th className="px-3 py-2">Created Date</th>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-700">
                            <tr className="hover:bg-zinc-50/60 transition-colors">
                              <td className="px-3 py-2.5 font-medium text-zinc-900">INQ001</td>
                              <td className="px-3 py-2.5">Mr. Alice</td>
                              <td className="px-3 py-2.5">Thailand</td>
                              <td className="px-3 py-2.5 font-mono">01-08-2026</td>
                              <td className="px-3 py-2.5 text-center">1</td>
                              <td className="px-3 py-2.5 text-center">1</td>
                              <td className="px-3 py-2.5">Mr. John</td>
                              <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-500">16-07-2026 05:03 PM</td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                  New
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button className="p-1 rounded bg-cyan-500 text-white hover:bg-cyan-600 shadow-xs cursor-pointer" title="Edit">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600 shadow-xs cursor-pointer" title="Delete">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Table Pagination footer */}
                      <div className="bg-zinc-50/70 px-3 py-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Showing 1 to 1 of 1 entries</span>
                        <div className="flex items-center gap-1">
                          <button className="px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600 cursor-pointer">Previous</button>
                          <button className="px-2 py-0.5 rounded bg-cyan-500 text-white font-semibold cursor-pointer">1</button>
                          <button className="px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600 cursor-pointer">Next</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Today's Follow-up Table */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-zinc-800 text-sm">Today&apos;s Follow-up</h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span>Show</span>
                        <span className="px-1.5 py-0.5 border border-zinc-200 rounded bg-zinc-50 font-medium">10</span>
                        <span>entries</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>Search:</span>
                        <input
                          type="text"
                          readOnly
                          placeholder=""
                          className="w-24 sm:w-32 px-2 py-0.5 border border-zinc-200 rounded bg-zinc-50 text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Styled Table 2 */}
                    <div className="rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="px-3 py-2">Inquiry No</th>
                              <th className="px-3 py-2">Customer</th>
                              <th className="px-3 py-2">Destination</th>
                              <th className="px-3 py-2">Travel Date</th>
                              <th className="px-3 py-2">Followup Type</th>
                              <th className="px-3 py-2">Followup Date</th>
                              <th className="px-3 py-2">Followup Remark</th>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-700">
                            <tr className="hover:bg-zinc-50/60 transition-colors">
                              <td className="px-3 py-2.5 font-medium text-zinc-900">INQ002</td>
                              <td className="px-3 py-2.5">Mr. Mike</td>
                              <td className="px-3 py-2.5">Thailand</td>
                              <td className="px-3 py-2.5 font-mono">10-08-2026</td>
                              <td className="px-3 py-2.5">Email</td>
                              <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-500">16-07-2026 05:03 PM</td>
                              <td className="px-3 py-2.5 text-zinc-600">reminder sent</td>
                              <td className="px-3 py-2.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  In Progress
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button className="p-1 rounded bg-cyan-500 text-white hover:bg-cyan-600 shadow-xs cursor-pointer" title="Edit">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600 shadow-xs cursor-pointer" title="Delete">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Table Pagination footer */}
                      <div className="bg-zinc-50/70 px-3 py-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Showing 1 to 1 of 1 entries</span>
                        <div className="flex items-center gap-1">
                          <button className="px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600 cursor-pointer">Previous</button>
                          <button className="px-2 py-0.5 rounded bg-cyan-500 text-white font-semibold cursor-pointer">1</button>
                          <button className="px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600 cursor-pointer">Next</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Tomorrow's Follow-up Table preview header */}
                  <div className="pt-2">
                    <h4 className="font-bold text-zinc-800 text-sm">Tomorrow&apos;s Follow-up</h4>
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
