'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, Share2, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { DEFAULT_BUSINESS } from '@shared/types/gstBilling';

export const AuthenticInvoiceShowcase: React.FC = () => {
  const business = DEFAULT_BUSINESS;

  return (
    <div className="w-full space-y-8 select-none">
      <div className="max-w-2xl space-y-2">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {'// 04. AUTHENTIC A4 TAX INVOICE OUTPUT'}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Statutory Compliant Tax Invoice & Instant Print
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Every generated bill formats into an authentic Indian Tax Invoice containing your shop&apos;s legal GSTIN, recipient party details, itemized HSN breakdown, statutory tax split, and total amount in words.
        </p>
      </div>

      {/* A4 Sheet Container */}
      <div className="relative mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl border border-black/[0.1] p-6 sm:p-10 text-zinc-900 overflow-hidden">
        
        {/* Top Floating Actions Bar */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-black/[0.08] mb-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Finalized & Immutable
            </span>
            <span className="font-mono text-xs text-zinc-500">
              Format: Standard A4 • Portrait
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/items/new"
              className="px-3.5 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Test Print in Workspace</span>
            </Link>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-black/[0.08]">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
              TAX INVOICE
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-1">
              {business.name}
            </h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-md leading-relaxed">
              {business.address}
            </p>
            <div className="mt-2 text-xs font-mono space-y-0.5 text-zinc-700">
              <div>
                <span className="font-bold text-zinc-900">GSTIN:</span> {business.gstin}
              </div>
              <div>
                <span className="font-bold text-zinc-900">State:</span> {business.state} (Code: {business.stateCode}) • <span className="font-bold text-zinc-900">Phone:</span> {business.phone}
              </div>
              <div>
                <span className="font-bold text-zinc-900">Email:</span> {business.email}
              </div>
            </div>
          </div>

          {/* Invoice Meta Pill */}
          <div className="sm:text-right bg-[#FAF9F5] p-4 rounded-xl border border-black/[0.06] shrink-0 min-w-[200px]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              INVOICE NUMBER
            </div>
            <div className="font-mono font-extrabold text-base text-zinc-900 mt-0.5">
              INV-2026-4749
            </div>
            <div className="text-[11px] text-zinc-600 mt-2">
              <span className="text-zinc-400">Date:</span> 2026-09-19
            </div>
            <div className="text-[11px] text-zinc-600">
              <span className="text-zinc-400">Place of Supply:</span> Gujarat (24)
            </div>
          </div>
        </div>

        {/* Bill To & Dispatch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-black/[0.08] text-xs">
          <div className="space-y-1 bg-[#F7F5EF] p-4 rounded-xl border border-black/[0.04]">
            <div className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              DETAILS OF RECEIVER (BILLED TO)
            </div>
            <div className="font-bold text-sm text-zinc-950">Rajesh Traders</div>
            <div className="text-zinc-600">Shop 12, APMC Market Yard, Rajkot</div>
            <div className="text-zinc-700 font-mono pt-1">
              State: <span className="font-semibold text-zinc-900">Gujarat (24)</span> • Mobile: +91 98251 23456
            </div>
            <div className="text-zinc-700 font-mono">
              GSTIN: <span className="font-semibold text-zinc-900">24AABCR1234F1Z9</span>
            </div>
          </div>

          <div className="space-y-1 bg-[#F7F5EF] p-4 rounded-xl border border-black/[0.04]">
            <div className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              SUPPLY TERMS & TAX RULE
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-600">Tax Supply Rule:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Intra-State (CGST 50% + SGST 50%)
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-600">Payment Terms:</span>
              <span className="font-semibold text-zinc-900">Paid in Full</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-600">Reverse Charge:</span>
              <span className="font-semibold text-zinc-900">NO</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black/[0.1] text-zinc-500 font-mono uppercase text-[10px]">
                <th className="py-2.5 pr-2">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 font-mono">HSN/SAC</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 text-center">GST %</th>
                <th className="py-2.5 pl-3 text-right">Line Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-zinc-800">
              <tr>
                <td className="py-3 pr-2 font-mono text-zinc-400">1</td>
                <td className="py-3 px-3 font-semibold text-zinc-900">
                  Basmati Rice (25kg Premium Bag)
                </td>
                <td className="py-3 px-3 font-mono text-zinc-600">1006</td>
                <td className="py-3 px-3 text-right font-mono">2</td>
                <td className="py-3 px-3 text-right font-mono">₹1,850.00</td>
                <td className="py-3 px-3 text-center font-mono">5%</td>
                <td className="py-3 pl-3 text-right font-mono font-semibold">₹3,885.00</td>
              </tr>
              <tr>
                <td className="py-3 pr-2 font-mono text-zinc-400">2</td>
                <td className="py-3 px-3 font-semibold text-zinc-900">
                  Electrical LED Tube 20W (Pack of 10)
                </td>
                <td className="py-3 px-3 font-mono text-zinc-600">8539</td>
                <td className="py-3 px-3 text-right font-mono">1</td>
                <td className="py-3 px-3 text-right font-mono">₹1,450.00</td>
                <td className="py-3 px-3 text-center font-mono">18%</td>
                <td className="py-3 pl-3 text-right font-mono font-semibold">₹1,711.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Summary & Words Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t-2 border-black/[0.1]">
          {/* Left: Amount in Words & Declaration */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-black/[0.06]">
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                INVOICE TOTAL IN WORDS
              </div>
              <div className="text-xs font-bold text-zinc-900 italic mt-0.5">
                Five Thousand Five Hundred and Ninety Six Rupees Only
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 leading-relaxed border-l-2 border-zinc-300 pl-3">
              <div className="font-semibold text-zinc-700">Declaration:</div>
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Goods once sold will not be taken back.
            </div>
          </div>

          {/* Right: Subtotal, CGST, SGST, Grand Total */}
          <div className="md:col-span-5 space-y-1.5 text-xs">
            <div className="flex justify-between items-center py-1 text-zinc-600">
              <span>Taxable Amount (Subtotal):</span>
              <span className="font-mono font-bold text-zinc-900">₹5,150.00</span>
            </div>
            <div className="flex justify-between items-center py-1 text-emerald-800">
              <span>Central Tax (CGST):</span>
              <span className="font-mono font-bold">₹223.00</span>
            </div>
            <div className="flex justify-between items-center py-1 text-emerald-800">
              <span>State Tax (SGST):</span>
              <span className="font-mono font-bold">₹223.00</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-t border-black/[0.06] text-zinc-700 font-semibold">
              <span>Total Tax:</span>
              <span className="font-mono text-zinc-900">₹446.00</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-t-2 border-black/[0.1] bg-[#F7F5EF] p-2.5 rounded-xl text-sm font-extrabold text-zinc-950">
              <span>GRAND TOTAL:</span>
              <span className="font-mono text-base text-zinc-950">₹5,596.00</span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-8 pt-4 border-t border-black/[0.06] flex justify-between items-end text-xs text-zinc-500">
          <div>Customer Signature</div>
          <div className="text-right">
            <div className="font-bold text-zinc-900">For {business.name}</div>
            <div className="text-[10px] text-zinc-400 mt-6">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
};
