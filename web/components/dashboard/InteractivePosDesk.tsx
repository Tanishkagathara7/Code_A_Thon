'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Users,
  Package,
  Printer,
  TrendingUp,
  Plus,
  Minus,
  Check,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, numberToWordsIndian } from '@/lib/utils';

interface LineItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

const INITIAL_ITEMS: LineItem[] = [
  {
    id: 'item_1',
    name: 'Basmati Rice 5kg Pack',
    hsn: '1006',
    qty: 10,
    rate: 450,
    gstRate: 5,
  },
  {
    id: 'item_2',
    name: 'Sunflower Refined Oil 1L',
    hsn: '1512',
    qty: 20,
    rate: 140,
    gstRate: 5,
  },
];

type DeskTab = 'billing' | 'parties' | 'products' | 'sales';

export const InteractivePosDesk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeskTab>('billing');
  const [items, setItems] = useState<LineItem[]>(INITIAL_ITEMS);
  const [printed, setPrinted] = useState(false);

  const adjustQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const totalTax = items.reduce((acc, item) => acc + (item.qty * item.rate * item.gstRate) / 100, 0);
  const grandTotal = subtotal + totalTax;
  const amountInWords = numberToWordsIndian(grandTotal);

  return (
    <div className="w-full select-none">
      {/* Outer Device Frame (Dark Bezel matching the screenshot) */}
      <div className="relative rounded-[2rem] bg-[#1E242B] p-2.5 sm:p-4 border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.06] pointer-events-none z-20 rounded-[1.8rem]" />

        {/* Inner POS / Billing Container */}
        <div className="relative rounded-[1.6rem] bg-[#FFFDF8] overflow-hidden shadow-inner flex flex-col min-h-[480px] text-zinc-900 border border-[#E2E4E9]">
          
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
          <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
            
            {/* Left Mini Sidebar */}
            <div className="w-full sm:w-48 bg-[#FAF9F5] border-b sm:border-b-0 sm:border-r border-[#E2E4E9] p-3 flex flex-col justify-between shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'billing'
                      ? 'bg-[#0A0A0A] text-white shadow-xs'
                      : 'text-[#525866] hover:bg-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Billing Desk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('parties')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'parties'
                      ? 'bg-[#0A0A0A] text-white shadow-xs'
                      : 'text-[#525866] hover:bg-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Parties (Khata)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#0A0A0A] text-white shadow-xs'
                      : 'text-[#525866] hover:bg-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Products & HSN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sales')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'sales'
                      ? 'bg-[#0A0A0A] text-white shadow-xs'
                      : 'text-[#525866] hover:bg-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Sales & Tax</span>
                </button>
              </div>

              {/* Today's Collection Box */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E2E4E9] text-xs space-y-1 mt-3 sm:mt-0 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-[#868C98]">Today&apos;s Collection</div>
                <div className="font-extrabold text-sm text-[#0A0A0A] font-mono">₹48,920.00</div>
                <div className="text-[10px] text-[#16A34A] font-medium">18 bills generated</div>
              </div>
            </div>

            {/* Right Tab Content */}
            {activeTab === 'billing' ? (
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
                  <table className="w-full text-left text-xs" aria-label="Invoice Line Items">
                    <thead className="bg-[#F7F5EF] border-b border-[#E2E4E9] text-[#525866] font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Item Description</th>
                        <th className="px-3 py-2.5 font-mono">HSN</th>
                        <th className="px-3 py-2.5 text-center font-mono">Qty (Live)</th>
                        <th className="px-3 py-2.5 text-right font-mono">Rate (₹)</th>
                        <th className="px-3 py-2.5 text-right font-mono">Taxable (₹)</th>
                        <th className="px-3 py-2.5 text-center font-mono">GST %</th>
                        <th className="px-3 py-2.5 text-right font-mono">Tax (₹)</th>
                        <th className="px-3.5 py-2.5 text-right font-mono">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono text-zinc-800">
                      {items.map((item) => {
                        const taxable = item.qty * item.rate;
                        const tax = (taxable * item.gstRate) / 100;
                        const total = taxable + tax;
                        return (
                          <tr key={item.id} className="hover:bg-zinc-50/50">
                            <td className="px-3.5 py-2.5 font-sans font-medium text-zinc-900">
                              {item.name}
                            </td>
                            <td className="px-3 py-2.5 text-zinc-500">{item.hsn}</td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center justify-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-lg w-fit mx-auto">
                                <button
                                  type="button"
                                  onClick={() => adjustQty(item.id, -1)}
                                  className="w-4 h-4 rounded flex items-center justify-center text-zinc-600 hover:bg-zinc-200 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-zinc-900 min-w-4 text-center">{item.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => adjustQty(item.id, 1)}
                                  className="w-4 h-4 rounded flex items-center justify-center text-zinc-600 hover:bg-zinc-200 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-right">{item.rate.toFixed(2)}</td>
                            <td className="px-3 py-2.5 text-right">{taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2.5 text-center text-emerald-700">{item.gstRate}%</td>
                            <td className="px-3 py-2.5 text-right text-zinc-600">{tax.toFixed(2)}</td>
                            <td className="px-3.5 py-2.5 text-right font-bold text-zinc-900">
                              {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#525866]">
                    Amount in words:{' '}
                    <span className="font-semibold text-zinc-800 italic">
                      {amountInWords}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-white border border-[#E2E4E9] px-4 py-2.5 rounded-xl shadow-xs">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#525866]">
                        Grand Total (Incl. Taxes)
                      </div>
                      <div className="text-lg font-black font-mono text-[#0A0A0A]">
                        ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pl-3 border-l border-[#E2E4E9]">
                      <Link
                        href="/items/new"
                        onClick={() => setPrinted(true)}
                        className="px-4 py-2 bg-[#0A0A0A] hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        {printed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Printer className="w-3.5 h-3.5" />}
                        <span>{printed ? 'Bill Saved' : 'Print Tax Invoice'}</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            ) : activeTab === 'parties' ? (
              <div className="flex-1 p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0A0A0A]">Trade Parties & Khata Ledgers</h3>
                  <Link href="/items/new" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <span>New Party</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl border border-[#E2E4E9] hover:border-zinc-400 transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900">Rajesh Traders (Gujarat)</div>
                      <div className="text-[11px] text-zinc-500 font-mono">GSTIN: 24AABCT1357Q1ZP • Mobile: 9825123456</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-700">₹14,200.00 Due</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E2E4E9] hover:border-zinc-400 transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900">Shreeji Electronics (Gujarat)</div>
                      <div className="text-[11px] text-zinc-500 font-mono">GSTIN: 24AABCS9876K1Z3 • Mobile: 9825987654</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-zinc-500">Paid in Full</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E2E4E9] hover:border-zinc-400 transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900">Mumbai Textile Syndicate (Maharashtra)</div>
                      <div className="text-[11px] text-zinc-500 font-mono">GSTIN: 27AAACT9012L1Z4 • Inter-State IGST 12%</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-700">₹32,450.00 Due</span>
                  </div>
                </div>
              </div>
            ) : activeTab === 'products' ? (
              <div className="flex-1 p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0A0A0A]">Product Catalog & Statutory HSN</h3>
                  <Link href="/items/new" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <span>Add Item</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#E2E4E9] space-y-1">
                    <div className="font-bold text-xs text-zinc-900">Basmati Rice (25kg Bag)</div>
                    <div className="text-[11px] text-zinc-500 font-mono">HSN: 1006 • Rate: ₹1,850.00</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">5% GST</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E2E4E9] space-y-1">
                    <div className="font-bold text-xs text-zinc-900">Cold-Pressed Groundnut Oil (15L)</div>
                    <div className="text-[11px] text-zinc-500 font-mono">HSN: 1508 • Rate: ₹2,750.00</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">5% GST</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E2E4E9] space-y-1">
                    <div className="font-bold text-xs text-zinc-900">Refined Wheat Flour (Maida 50kg)</div>
                    <div className="text-[11px] text-zinc-500 font-mono">HSN: 1101 • Rate: ₹1,650.00</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">5% GST</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E2E4E9] space-y-1">
                    <div className="font-bold text-xs text-zinc-900">Electrical LED Tube 20W (Pack 10)</div>
                    <div className="text-[11px] text-zinc-500 font-mono">HSN: 8539 • Rate: ₹1,450.00</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">18% GST</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0A0A0A]">Sales Revenue & Tax Slabs Breakup</h3>
                  <Link href="/dashboard/analytics" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <span>Full Analytics</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="text-xs font-bold text-zinc-500">TODAY&apos;S TAXABLE SALES</div>
                    <div className="text-xl font-black font-mono text-zinc-950 mt-1">₹44,270.00</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">18 bills processed</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-800">TOTAL GST COLLECTED</div>
                    <div className="text-xl font-black font-mono text-emerald-950 mt-1">₹4,650.00</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">CGST ₹2,325 + SGST ₹2,325</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
