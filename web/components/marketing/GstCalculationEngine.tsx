'use client';

import React, { useState, useId } from 'react';
import { Calculator, ArrowRight, Percent, CheckCircle2, RefreshCw } from 'lucide-react';
import { INDIAN_STATES, GST_SLABS, DEFAULT_BUSINESS } from '@shared/types/gstBilling';

export const GstCalculationEngine: React.FC = () => {
  const shopState = DEFAULT_BUSINESS.state; // 'Gujarat'
  const shopStateCode = DEFAULT_BUSINESS.stateCode; // '24'
  const shopStateSelectId = useId();
  const partyStateSelectId = useId();

  // Interactive state
  const [selectedPartyState, setSelectedPartyState] = useState<string>('Gujarat');
  const [qty, setQty] = useState<number>(2);
  const [rate, setRate] = useState<number>(1850);
  const [gstRate, setGstRate] = useState<number>(18);
  const [itemName, setItemName] = useState<string>('Basmati Rice (25kg Premium Bag)');
  const [hsnCode, setHsnCode] = useState<string>('1006');

  const isIntraState = selectedPartyState.trim().toLowerCase() === shopState.trim().toLowerCase();
  const partyStateObj = INDIAN_STATES.find(s => s.name.toLowerCase() === selectedPartyState.toLowerCase()) || { name: selectedPartyState, code: '24' };

  // Calculations
  const taxableAmount = Math.max(0, qty * rate);
  const totalTax = (taxableAmount * gstRate) / 100;
  const grandTotal = taxableAmount + totalTax;

  const cgstRate = isIntraState ? gstRate / 2 : 0;
  const cgstAmount = isIntraState ? totalTax / 2 : 0;
  const sgstRate = isIntraState ? gstRate / 2 : 0;
  const sgstAmount = isIntraState ? totalTax / 2 : 0;
  const igstRate = !isIntraState ? gstRate : 0;
  const igstAmount = !isIntraState ? totalTax : 0;

  return (
    <div className="w-full space-y-8 select-none">
      <div className="max-w-2xl space-y-2">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {'// 03. STATUTORY TAX CALCULATION ENGINE'}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Deterministic Intra-State & Inter-State GST Split
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          The engine automatically compares your shop state with the party destination. Try switching between Gujarat (Same State) and Maharashtra / Karnataka (Different State) below to see the statutory tax split update dynamically.
        </p>
      </div>

      {/* Main Interactive Tax Simulator Box */}
      <div className="bento-card p-6 sm:p-8 bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-xl rounded-3xl space-y-6">
        
        {/* Top Control Bar: States comparison */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#F7F5EF] p-4 sm:p-5 rounded-2xl border border-black/[0.06]">
          {/* Shop State */}
          <div className="md:col-span-5 space-y-1">
            <label htmlFor={shopStateSelectId} className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
              SUPPLIER LOCATION (YOUR SHOP)
            </label>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div id={shopStateSelectId} className="font-bold text-zinc-900 text-sm sm:text-base">
                {shopState} <span className="font-mono text-xs text-zinc-500 font-normal">(State Code: {shopStateCode})</span>
              </div>
            </div>
            <div className="text-xs text-zinc-500">Shop 14, Commercial Complex, Rajkot</div>
          </div>

          {/* Indicator Arrow */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0">
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-xs transition-colors ${
              isIntraState 
                ? 'bg-[#F1F8F2] text-[#16A34A] border-emerald-200' 
                : 'bg-[#F4F7FB] text-[#2563EB] border-blue-200'
            }`}>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{isIntraState ? 'INTRA-STATE' : 'INTER-STATE'}</span>
            </div>
          </div>

          {/* Party State Selector */}
          <div className="md:col-span-5 space-y-1">
            <label htmlFor={partyStateSelectId} className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
              PLACE OF SUPPLY (CUSTOMER STATE)
            </label>
            <div className="flex items-center gap-2">
              <select
                id={partyStateSelectId}
                value={selectedPartyState}
                onChange={(e) => setSelectedPartyState(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-xs"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name} ({st.code}) {st.name === shopState ? '• Same State' : '• Different State'}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-zinc-500">
              {isIntraState ? 'Triggers CGST (50%) + SGST (50%)' : 'Triggers 100% IGST (Integrated Tax)'}
            </div>
          </div>
        </div>

        {/* Input Parameters: Item, Qty, Rate, GST Slab */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
              Item Description
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
              HSN Code
            </label>
            <input
              type="text"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
              Quantity
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
              Unit Rate (₹)
            </label>
            <input
              type="number"
              min="0"
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
              GST Slab Rate
            </label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(parseInt(e.target.value))}
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
            >
              {GST_SLABS.map((s) => (
                <option key={s} value={s}>
                  {s}% GST
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Calculation Output Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-black/[0.06]">
          {/* Left: Step-by-Step Statutory Breakdown */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
              <span>STATUTORY TAX BREAKDOWN</span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Formula Verified
              </span>
            </div>

            <div className="space-y-2 bg-[#FFFDF8] p-4 rounded-2xl border border-black/[0.06] text-xs">
              {/* Line Taxable */}
              <div className="flex justify-between items-center py-1 border-b border-black/[0.04]">
                <span className="text-zinc-600">
                  Taxable Amount <span className="font-mono text-[11px] text-zinc-400">(Qty {qty} × ₹{rate.toLocaleString('en-IN')})</span>:
                </span>
                <span className="font-mono font-bold text-zinc-900">
                  ₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Conditional Split */}
              {isIntraState ? (
                <>
                  <div className="flex justify-between items-center py-1 text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Central Tax (CGST @ {cgstRate}%):
                    </span>
                    <span className="font-mono font-bold">
                      ₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-emerald-800 border-b border-black/[0.04]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      State Tax (SGST @ {sgstRate}%):
                    </span>
                    <span className="font-mono font-bold">
                      ₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center py-1 text-blue-800 border-b border-black/[0.04]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Integrated Tax (IGST @ {igstRate}% in full):
                  </span>
                  <span className="font-mono font-bold">
                    ₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Total Tax */}
              <div className="flex justify-between items-center py-1 font-semibold text-zinc-700">
                <span>Total Tax Amount:</span>
                <span className="font-mono text-zinc-900">
                  ₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Grand Total Card */}
          <div className="lg:col-span-5 bg-[#FAF9F5] border border-zinc-200/90 text-zinc-900 p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                FINAL INVOICE SETTLEMENT
              </div>
              <div className="mt-2 text-xs text-zinc-600">
                Applied Rule:{' '}
                <span className="font-bold text-zinc-950">
                  {isIntraState ? 'Same State CGST+SGST 50:50 Split' : 'Inter-State Full IGST Applied'}
                </span>
              </div>
            </div>

            <div className="my-4 pt-3 border-t border-zinc-200/80">
              <div className="text-xs font-semibold text-zinc-500 uppercase font-mono">GRAND TOTAL (INCL. TAX)</div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-zinc-950 mt-1">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 italic mt-1">
                Amount rounded to statutory Indian precision
              </div>
            </div>

            <div className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ready for immediate A4 Tax Invoice compilation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
