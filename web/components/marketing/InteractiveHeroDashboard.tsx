'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  Layers,
  Zap,
  Plus,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  FileText,
  Search,
  MessageSquare,
  Printer,
  MousePointerClick,
  Info
} from 'lucide-react';
import { MarkdownView } from '@/components/ui/MarkdownView';

interface MockInvoice {
  id: string;
  invoiceNo: string;
  partyName: string;
  state: string;
  grandTotal: number;
  totalTax: number;
  paymentStatus: 'Paid in Full' | 'Credit / Due';
  date: string;
}

const DEMO_INVOICES: MockInvoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-2026-4749',
    partyName: 'Tanish Enterprise',
    state: 'Gujarat',
    grandTotal: 3468.24,
    totalTax: 325.24,
    paymentStatus: 'Paid in Full',
    date: 'Sep 19, 2026, 09:50 AM',
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-2026-8202',
    partyName: 'Rajesh Traders',
    state: 'Gujarat',
    grandTotal: 6772.50,
    totalTax: 322.50,
    paymentStatus: 'Paid in Full',
    date: 'Sep 19, 2026, 09:23 AM',
  },
];

export const InteractiveHeroDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<MockInvoice[]>(DEMO_INVOICES);
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<string | null>(
    `• **Today's Invoiced Volume:** ₹10,240.74 across 2 verified tax invoices.\n• **Statutory GST Liability:** ₹647.74 (CGST: ₹323.87, SGST: ₹323.87).\n• **ITC & Audit Risk:** 0 flags. 100% compliant intra-state Gujarat supply.`
  );
  const [copied, setCopied] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<MockInvoice | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalGst = invoices.reduce((sum, inv) => sum + inv.totalTax, 0);
  const invoiceCount = invoices.length;
  const paidCount = invoices.filter((inv) => inv.paymentStatus === 'Paid in Full').length;
  const collectionRatio = invoiceCount > 0 ? Math.round((paidCount / invoiceCount) * 100) : 100;

  const handleQuickAddBill = () => {
    const nextNum = 5000 + Math.floor(Math.random() * 4000);
    const parties = ['Ambica Provision', 'Shree Sai Stores', 'Krishna Mart'];
    const newBill: MockInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2026-${nextNum}`,
      partyName: parties[Math.floor(Math.random() * parties.length)],
      state: 'Gujarat',
      grandTotal: Math.round((3100 + Math.random() * 2500) * 100) / 100,
      totalTax: 280.00,
      paymentStatus: 'Paid in Full',
      date: 'Just now',
    };
    setInvoices([newBill, ...invoices]);
    triggerToast(`Added demo bill #${newBill.invoiceNo} (+₹${newBill.grandTotal.toLocaleString('en-IN')})`);
  };

  const runCopilotQuery = (query: string) => {
    setCopilotLoading(true);
    setCopilotResponse(null);
    setTimeout(() => {
      setCopilotLoading(false);
      if (query.includes('Summarize') || query.includes('sales')) {
        setCopilotResponse(
          `### 📊 Daily Sales & GST Summary\n\n| Metric | Value | Compliance Status |\n|---|---|---|\n| **Total Volume** | ₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })} | Verified |\n| **Statutory Tax** | ₹${totalGst.toFixed(2)} | CGST 50% + SGST 50% |\n| **Paid in Full** | ${collectionRatio}% | Healthy Collection |\n\n> **Statutory Advisory:** All transactions reflect compliant intra-state invoices with valid recipient identification.`
        );
      } else if (query.includes('Tax') || query.includes('HSN')) {
        setCopilotResponse(
          `### 📋 HSN & Tax Slab Classification\n\n| Item / Category | HSN Code | Rate | Supply Rule |\n|---|---|---|---|\n| Basmati Rice (Pack) | **1006** | 5% | Intra-State (Gujarat 24) |\n| Refined Edible Oil | **1512** | 5% | Intra-State (Gujarat 24) |\n| Electrical Appliances | **8504** | 18% | Verified Slab |\n\n*Zero GST audit discrepancies detected on current counters.*`
        );
      } else {
        setCopilotResponse(
          `### 💳 Party Khata & Payment Advice\n\n- **Total Customer Accounts:** ${invoiceCount}\n- **Dues Requiring Action:** 0 outstanding khata notices required.\n- **Collection Ratio:** 100% on counter billing transactions.`
        );
      }
    }, 450);
  };

  const handleCustomCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotPrompt.trim()) return;
    runCopilotQuery(copilotPrompt);
    setCopilotPrompt('');
  };

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full relative select-none">
      {/* Top Header Pill & Interactive Badge */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold border border-emerald-500/20">
            <MousePointerClick className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            <span>Interactive Demo Preview</span>
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Click quick actions, tabs, and prompts to test live state updates.
          </span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-emerald-700 transition-colors bg-white px-3 py-1 rounded-lg border border-zinc-200 shadow-2xs hover:shadow-xs"
        >
          <span>Open Full Workspace</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Glassmorphic Showcase Shell */}
      <div className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-zinc-200/80 p-4 sm:p-6 shadow-xl shadow-zinc-950/5 space-y-5 text-zinc-900">
        
        {/* ========================================================
            1. COMMAND BANNER (WARM EDITORIAL & REFINED)
           ======================================================== */}
        <div className="rounded-xl sm:rounded-2xl bg-[#FAF9F5] border border-zinc-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
          {/* Subtle warm tint accent */}
          <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/5 blur-2xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                GSTIN: 24AAACV1234F1Z5
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[10px] font-semibold">
                Gujarat (24) • FY 2025-26
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 flex items-center gap-2">
              <span>GST Billing & Sales Hub</span>
            </h3>

            <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">
              Real-time counter invoicing, automatic CGST/SGST splitting, and instant statutory tax ledger reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 relative z-10 shrink-0">
            <button
              type="button"
              onClick={handleQuickAddBill}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Demo Bill</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition-all border border-zinc-300/80 shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span>Bill History</span>
            </Link>
          </div>
        </div>

        {/* ========================================================
            2. FOUR COMPACT STAT CARDS
           ======================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: TOTAL SALES */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-200/70 text-zinc-800 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Today's Sales
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                ↑ 18.4%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight font-mono">
                ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Counter sales volume</p>
            </div>
          </div>

          {/* Card 2: GST COLLECTED */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  GST Collected
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Split
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight font-mono">
                ₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">CGST + SGST liability</p>
            </div>
          </div>

          {/* Card 3: INVOICES */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Invoices
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Live
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight font-mono">
                {invoiceCount}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Bills issued today</p>
            </div>
          </div>

          {/* Card 4: COLLECTION HEALTH */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Collection Ratio
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Healthy
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight font-mono">
                {collectionRatio}%
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">Paid in full vs khata due</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. ACTIVITY CHART & COMPACT AI COPILOT
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Activity Trend (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Billing & Invoicing Activity
                </h4>
                <p className="text-[11px] text-zinc-500">Real-time invoice generation frequency</p>
              </div>

              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg text-[11px] font-semibold">
                {(['24H', '7D', '30D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setTimeRange(r);
                      triggerToast(`Switched chart window to ${r}`);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      timeRange === r ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive Activity Spline & Bars */}
            <div className="relative w-full h-36 pt-2 select-none">
              <svg viewBox="0 0 600 130" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[20, 15, 10, 5, 0].map((val, idx) => {
                  const y = 14 + idx * 22;
                  return (
                    <g key={val}>
                      <text x="5" y={y + 3} className="text-[9px] fill-zinc-400 font-mono">
                        {val}
                      </text>
                      <line x1="24" y1={y} x2="590" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                    </g>
                  );
                })}

                {/* Realistic Dynamic Bar Pillars reflecting counter billing rushes */}
                {(() => {
                  // Activity distribution over time slots
                  const distribution = timeRange === '24H'
                    ? [2, 3, 5, 4, 8, 14, 18, 15, 12, 9, 11, 16, 19, 14, 8, 4]
                    : timeRange === '7D'
                    ? [12, 18, 22, 19, 25, 31, 28, 24, 26, 30, 35, 29, 24, 20, 15, 11]
                    : [45, 52, 60, 58, 64, 72, 80, 75, 68, 70, 85, 78, 72, 65, 55, 48];
                  
                  const maxH = Math.max(...distribution);

                  return distribution.map((val, i) => {
                    const x = 36 + i * 36;
                    const baseY = 102;
                    // Extra surge if demo bill added
                    const surge = (invoices.length > 2 && i === 12) ? 14 : 0;
                    const barHeight = Math.min(68, ((val + surge) / maxH) * 58);
                    const isPeak = (val + surge) === maxH || (invoices.length > 2 && i === 12);

                    return (
                      <g key={i}>
                        {/* Background subtle column */}
                        <rect
                          x={x - 4.5}
                          y={baseY - barHeight}
                          width="9"
                          height={barHeight}
                          fill={isPeak ? '#10B981' : '#6366F1'}
                          opacity={isPeak ? '0.85' : '0.55'}
                          rx="2.5"
                        />
                      </g>
                    );
                  });
                })()}

                {/* Fluid Curvature Spline matching counter billing trends */}
                {(() => {
                  const points = timeRange === '24H'
                    ? [
                        { x: 36, y: 92 },
                        { x: 72, y: 88 },
                        { x: 108, y: 80 },
                        { x: 144, y: 82 },
                        { x: 180, y: 64 },
                        { x: 216, y: 46 },
                        { x: 252, y: 32 },
                        { x: 288, y: 40 },
                        { x: 324, y: 50 },
                        { x: 360, y: 58 },
                        { x: 396, y: 52 },
                        { x: 432, y: 38 },
                        { x: 468, y: invoices.length > 2 ? 22 : 30 },
                        { x: 504, y: 44 },
                        { x: 540, y: 66 },
                        { x: 576, y: 84 },
                      ]
                    : [
                        { x: 36, y: 60 },
                        { x: 108, y: 45 },
                        { x: 180, y: 38 },
                        { x: 252, y: 28 },
                        { x: 324, y: 32 },
                        { x: 396, y: 24 },
                        { x: 468, y: 18 },
                        { x: 540, y: 36 },
                        { x: 576, y: 48 },
                      ];

                  const pathD = points.reduce((acc, pt, i, arr) => {
                    if (i === 0) return `M ${pt.x},${pt.y}`;
                    const prev = arr[i - 1];
                    const cx1 = prev.x + (pt.x - prev.x) / 2;
                    const cy1 = prev.y;
                    const cx2 = prev.x + (pt.x - prev.x) / 2;
                    const cy2 = pt.y;
                    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
                  }, '');

                  const areaD = `${pathD} L ${points[points.length - 1].x},102 L ${points[0].x},102 Z`;

                  return (
                    <g>
                      <path d={areaD} fill="url(#chartGlow)" />
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {points.map((pt, i) => (
                        <circle
                          key={i}
                          cx={pt.x}
                          cy={pt.y}
                          r={i === 12 && invoices.length > 2 ? '4.5' : '3'}
                          fill="#FFFFFF"
                          stroke={i === 12 && invoices.length > 2 ? '#10B981' : '#2563EB'}
                          strokeWidth="2"
                        />
                      ))}
                    </g>
                  );
                })()}
              </svg>

              <div className="flex justify-between pl-6 pr-2 text-[9px] text-zinc-400 font-sans mt-0.5">
                {['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((lbl) => (
                  <span key={lbl}>{lbl}</span>
                ))}
              </div>
            </div>

            {/* Bottom Chart Footer Legend */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Tax Invoices</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Paid in Full</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Volume Trend</span>
                </span>
              </div>
              <span className="font-mono text-zinc-700 font-bold">{invoiceCount} bills logged today</span>
            </div>
          </div>

          {/* GST AI Copilot Assistant (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-zinc-50/70 flex flex-col justify-between shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">GST AI Copilot</span>
                    <span className="text-[10px] text-zinc-500">Tax slab guidance & khata advisory</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Online
                </span>
              </div>

              {/* Quick action chips */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => runCopilotQuery('Summarize sales')}
                  disabled={copilotLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
                >
                  ⚡ Sales Summary
                </button>
                <button
                  type="button"
                  onClick={() => runCopilotQuery('Tax & HSN audit')}
                  disabled={copilotLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
                >
                  📋 HSN Finder
                </button>
                <button
                  type="button"
                  onClick={() => runCopilotQuery('Khata reminder')}
                  disabled={copilotLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
                >
                  💳 Khata Advisory
                </button>
              </div>

              {/* Copilot Response Card */}
              {copilotLoading ? (
                <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs text-indigo-600 flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Synthesizing tax rules...</span>
                </div>
              ) : copilotResponse ? (
                <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs space-y-1.5 max-h-40 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-1 text-[10px]">
                    <span className="font-bold text-indigo-600">Copilot Directive</span>
                    <button
                      type="button"
                      onClick={() => copyText(copilotResponse)}
                      className="text-zinc-500 hover:text-zinc-800 font-medium cursor-pointer"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <MarkdownView content={copilotResponse} />
                </div>
              ) : null}
            </div>

            {/* Input */}
            <form onSubmit={handleCustomCopilotSubmit} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={copilotPrompt}
                onChange={(e) => setCopilotPrompt(e.target.value)}
                placeholder="Ask about GST slabs or HSN..."
                className="flex-1 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotPrompt.trim()}
                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================
            4. COMPACT INVOICES & GST SLABS BREAKDOWN
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* Clean Invoices Table (8 cols) */}
          <div className="lg:col-span-8 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
                  ₹
                </span>
                <span className="text-xs font-bold text-zinc-900">Recent Customer Bills (Demo)</span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View All Invoices</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50/70 text-[10px] font-bold text-zinc-500 uppercase border-b border-zinc-100">
                  <tr>
                    <th className="px-4 py-2.5">Invoice</th>
                    <th className="px-4 py-2.5">Party</th>
                    <th className="px-4 py-2.5">State</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">GST</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-[11px] font-bold text-zinc-900">
                        {inv.invoiceNo}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-zinc-800">
                        {inv.partyName}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-500 text-[11px]">
                        {inv.state} (24)
                      </td>
                      <td className="px-4 py-2.5 font-mono font-bold text-zinc-900">
                        ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-zinc-600 text-[11px]">
                        ₹{inv.totalTax.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          <span className="w-1 h-1 rounded-full bg-emerald-600" />
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            triggerToast(`Opened preview for ${inv.invoiceNo}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Print / View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GST Slabs & Supply Breakdown (4 cols) */}
          <div className="lg:col-span-4 rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900">GST Slabs & Supply</span>
              <span className="text-[10px] text-zinc-500 font-medium">Gujarat (State 24)</span>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              {/* Donut graphic */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#4F46E5"
                    strokeWidth="12"
                    strokeDasharray="251.32 0"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-lg font-black text-zinc-900 leading-none font-mono">
                    {invoiceCount}
                  </span>
                  <span className="text-[9px] text-zinc-500">Invoices</span>
                </div>
              </div>

              {/* Breakdown Legend */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-zinc-700 text-[11px]">Intra-State (5%)</span>
                  </div>
                  <span className="font-bold text-zinc-900 font-mono">100%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                  <span>CGST: <strong>2.5%</strong></span>
                  <span>SGST: <strong>2.5%</strong></span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 p-2 rounded-lg text-[10px] text-zinc-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Full IGST / Inter-State logic active in live billing</span>
            </div>
          </div>
        </div>

      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 font-mono">{selectedInvoice.invoiceNo}</h4>
                <p className="text-[10px] text-zinc-500">Tax Invoice Receipt Preview</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {selectedInvoice.paymentStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Billed Party</span>
                <span className="font-bold text-zinc-900">{selectedInvoice.partyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">State of Supply</span>
                <span className="font-medium text-zinc-900">{selectedInvoice.state} (24)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">CGST + SGST (5%)</span>
                <span className="font-mono text-zinc-900">₹{selectedInvoice.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-sm text-zinc-900 pt-1">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700">₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3 h-3" />
                <span>Print Bill</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-zinc-700 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{showToast}</span>
        </div>
      )}
    </div>
  );
};
