'use client';

import React, { useRef } from 'react';
import {
  FileText,
  Users,
  Package,
  Printer,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const HeroProductShowcase: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ========================================================
          HERO MAIN STAGE: REALISTIC GST INVOICE COUNTER PREVIEW
         ======================================================== */}
      <div className="w-full relative py-0 select-none">
        <div className="relative max-w-5xl mx-auto pt-2 pb-4 px-2 sm:px-6">
          {/* Subtle warm decorative tints */}
          <div className="absolute -top-10 -left-12 w-64 h-64 bg-[#FEF7ED] rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="absolute -bottom-8 left-1/4 w-80 h-32 bg-[#F1F8F2] rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="absolute top-1/4 -right-10 w-72 h-72 bg-[#F4F7FB] rounded-full blur-2xl pointer-events-none -z-10" />
          
          {/* Main Desktop Dashboard & Invoice Body */}
          <div
            ref={stageRef}
            className="tablet-3d-body relative rounded-[2rem] bg-[#1E242B] p-2.5 sm:p-3.5 border border-zinc-800 shadow-2xl transition-transform duration-300 overflow-hidden"
          >
            {/* Glossy Screen Glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.06] pointer-events-none z-20 rounded-[1.8rem]" />

            {/* Inner POS / Billing Container */}
            <div className="relative rounded-[1.6rem] bg-[#FFFDF8] overflow-hidden shadow-inner flex flex-col min-h-[460px] text-zinc-900 border border-[#E2E4E9]">
              
              {/* Top Application Bar */}
              <div className="h-14 bg-white border-b border-[#E2E4E9] px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ₹
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-tight text-[#0A0A0A] leading-none">
                      Shreeji General Store
                    </div>
                    <div className="text-[10px] font-mono text-[#525866] mt-0.5">
                      GSTIN: 24AAACP1234M1Z5 • Gujarat (State 24)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F8F2] text-[#16A34A] border border-[#DCFCE7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    GST Portal Linked
                  </span>
                  <div className="hidden sm:flex items-center gap-1 bg-[#F4F7FB] px-2.5 py-1 rounded-lg text-xs font-mono text-[#525866] border border-[#E2E4E9]">
                    <span>Counter 01</span>
                  </div>
                </div>
              </div>

              {/* Two-Column Layout (Mini Navigation + Live Tax Invoice Workspace) */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* Left Mini Sidebar */}
                <div className="w-44 bg-[#FAF9F5] border-r border-[#E2E4E9] p-3 flex flex-col justify-between hidden sm:flex">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0A0A0A] text-white font-semibold text-xs shadow-xs">
                      <FileText className="w-4 h-4 text-white" />
                      <span>Billing Desk</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#525866] hover:bg-white text-xs font-medium transition-colors">
                      <Users className="w-4 h-4 text-[#868C98]" />
                      <span>Parties (Khata)</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#525866] hover:bg-white text-xs font-medium transition-colors">
                      <Package className="w-4 h-4 text-[#868C98]" />
                      <span>Products & HSN</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#525866] hover:bg-white text-xs font-medium transition-colors">
                      <TrendingUp className="w-4 h-4 text-[#868C98]" />
                      <span>Sales & Tax</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E4E9] text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#868C98]">Today&apos;s Collection</div>
                    <div className="font-extrabold text-sm text-[#0A0A0A] font-mono">₹48,920.00</div>
                    <div className="text-[10px] text-[#16A34A] font-medium">18 bills generated</div>
                  </div>
                </div>

                {/* Main Content: Live GST Invoice Creation Form */}
                <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-x-auto bg-[#FFFDF8]">
                  
                  {/* Bill Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E4E9]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0A0A0A] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          TAX INVOICE
                        </span>
                        <span className="font-mono text-xs font-semibold text-zinc-600">
                          #INV-2026-0042
                        </span>
                      </div>
                      <div className="text-xs text-[#525866] mt-1">
                        Billed To: <strong className="text-zinc-900">Rajesh Traders</strong> (GSTIN: 24AABCT1357Q1ZP • Gujarat)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-800 font-semibold bg-[#F1F8F2] border border-emerald-200 px-2.5 py-1 rounded-lg">
                        Intra-State (CGST 2.5% + SGST 2.5%)
                      </span>
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <div className="rounded-xl border border-[#E2E4E9] overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-left text-xs" aria-label="Invoice Line Items Preview">
                      <thead className="bg-[#F7F5EF] border-b border-[#E2E4E9] text-[#525866] font-semibold">
                        <tr>
                          <th className="px-3.5 py-2.5">Item Description</th>
                          <th className="px-3 py-2.5 font-mono">HSN</th>
                          <th className="px-3 py-2.5 text-right font-mono">Qty</th>
                          <th className="px-3 py-2.5 text-right font-mono">Rate (₹)</th>
                          <th className="px-3 py-2.5 text-right font-mono">Taxable (₹)</th>
                          <th className="px-3 py-2.5 text-center font-mono">GST %</th>
                          <th className="px-3 py-2.5 text-right font-mono">Tax (₹)</th>
                          <th className="px-3.5 py-2.5 text-right font-mono">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-mono text-zinc-800">
                        <tr className="hover:bg-zinc-50/50">
                          <td className="px-3.5 py-2.5 font-sans font-medium text-zinc-900">
                            Basmati Rice 5kg Pack
                          </td>
                          <td className="px-3 py-2.5 text-zinc-500">1006</td>
                          <td className="px-3 py-2.5 text-right">10</td>
                          <td className="px-3 py-2.5 text-right">450.00</td>
                          <td className="px-3 py-2.5 text-right">4,500.00</td>
                          <td className="px-3 py-2.5 text-center text-emerald-700">5%</td>
                          <td className="px-3 py-2.5 text-right text-zinc-600">225.00</td>
                          <td className="px-3.5 py-2.5 text-right font-bold text-zinc-900">4,725.00</td>
                        </tr>
                        <tr className="hover:bg-zinc-50/50">
                          <td className="px-3.5 py-2.5 font-sans font-medium text-zinc-900">
                            Sunflower Refined Oil 1L
                          </td>
                          <td className="px-3 py-2.5 text-zinc-500">1512</td>
                          <td className="px-3 py-2.5 text-right">20</td>
                          <td className="px-3 py-2.5 text-right">140.00</td>
                          <td className="px-3 py-2.5 text-right">2,800.00</td>
                          <td className="px-3 py-2.5 text-center text-emerald-700">5%</td>
                          <td className="px-3 py-2.5 text-right text-zinc-600">140.00</td>
                          <td className="px-3.5 py-2.5 text-right font-bold text-zinc-900">2,940.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-[#525866]">
                      Amount in words:{' '}
                      <span className="font-semibold text-zinc-800 italic">
                        Seven Thousand Six Hundred Sixty-Five Rupees Only
                      </span>
                    </div>

                    <div className="flex items-center gap-4 bg-white border border-[#E2E4E9] px-4 py-2.5 rounded-xl shadow-xs">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-[#525866]">
                          Grand Total (Incl. Taxes)
                        </div>
                        <div className="text-lg font-black font-mono text-[#0A0A0A]">
                          ₹7,665.00
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pl-3 border-l border-[#E2E4E9]">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Tax Invoice</span>
                        </button>
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
