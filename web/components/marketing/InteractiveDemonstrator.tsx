'use client';

import React, { useState } from 'react';
import { Users, ShoppingBag, Calculator, Printer, CheckCircle2, ArrowRight } from 'lucide-react';

export const InteractiveDemonstrator: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      phase: 'STEP 01',
      title: 'Customer (Party) Selection',
      subtitle: 'Identify Tax Residency & GSTIN',
      icon: Users,
      badge: 'Party Master',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      description:
        'Select a registered customer or enter a walk-in retail buyer. The system verifies their state code (e.g., Gujarat State 24) to prepare the statutory tax routing.',
      previewData: {
        customer: 'Rajesh Traders',
        phone: '+91 98251 23456',
        state: 'Gujarat (State Code 24)',
        gstin: '24AABCR1234F1Z9',
        type: 'Registered B2B Party',
      },
      highlights: ['Automatic State Matching', 'B2B GSTIN or B2C Walk-in', 'Khata Balance Tracking'],
    },
    {
      id: 1,
      phase: 'STEP 02',
      title: 'Product Catalog & HSN Entry',
      subtitle: 'Instant Item & Slab Selection',
      icon: ShoppingBag,
      badge: 'Item Catalog',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      description:
        'Add items from your saved catalog or type custom items. Unit price, statutory HSN code, and GST slab rate (0%, 5%, 12%, 18%, 28%) load instantly without manual typing.',
      previewData: {
        item: 'Basmati Rice (25kg Bag)',
        hsn: '1006 (Cereals)',
        rate: '₹1,850.00 / bag',
        quantity: '2 Bags',
        gstSlab: '5% Goods Slab',
      },
      highlights: ['HSN Code Classification', 'Reusable Product Prices', 'Custom Quantity Multiplier'],
    },
    {
      id: 2,
      phase: 'STEP 03',
      title: 'Statutory GST Tax Computation',
      subtitle: 'Same State vs Out of State',
      icon: Calculator,
      badge: 'Tax Engine',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      description:
        'The tax engine calculates Taxable Value = Rate × Qty. If Buyer State matches Shop State (Gujarat), it splits 50:50 between CGST and SGST. For other states, it computes IGST.',
      previewData: {
        taxableSubtotal: '₹3,700.00',
        cgstSplit: '2.5% = ₹92.50',
        sgstSplit: '2.5% = ₹92.50',
        totalTax: '₹185.00',
        grandTotal: '₹3,885.00',
      },
      highlights: ['CGST + SGST Equal Split', 'IGST Single Out-of-State Tax', 'Zero Calculation Drift'],
    },
    {
      id: 3,
      phase: 'STEP 04',
      title: 'A4 Tax Invoice & Share',
      subtitle: 'Print, WhatsApp & Save Ledger',
      icon: Printer,
      badge: 'Finalized Bill',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description:
        'Generates an immutable Tax Invoice with sequential number, date, amount in words, and legal declaration. Print directly to A4 or send 1-click summary to customer WhatsApp.',
      previewData: {
        invoiceNo: 'INV-2026-4749',
        date: '2026-09-19',
        status: 'Paid in Full',
        amountInWords: 'Three Thousand Eight Hundred Eighty-Five Only',
        delivery: 'A4 Print + WhatsApp Ready',
      },
      highlights: ['Sequential Numbering', 'Amount in Words Included', 'Immutable Audit Record'],
    },
  ];

  const current = steps[activeStep];
  const IconComponent = current.icon;

  return (
    <div className="w-full space-y-6 select-none">
      {/* Step Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          const StepIcon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-zinc-950 shadow-md ring-2 ring-zinc-950/10'
                  : 'bg-white/80 hover:bg-white border-black/[0.06] hover:border-black/[0.14]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-950" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-zinc-400">
                  {step.phase}
                </span>
                <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                  <StepIcon className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                  {step.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                  {step.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Step Showcase Card */}
      <div className="bento-card p-6 sm:p-8 bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-xl rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Explanation and Checklist */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-xs">
                <IconComponent className="w-3.5 h-3.5" />
                <span>{current.phase}: {current.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                {current.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {current.description}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {current.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{activeStep === steps.length - 1 ? 'Back to Step 1' : 'Next Billing Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-zinc-400 font-mono">
                Step {activeStep + 1} of 4
              </span>
            </div>
          </div>

          {/* Right Column: Visual Real Data Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF9F5] p-5 sm:p-6 rounded-2xl border border-black/[0.06] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  LIVE WORKFLOW PREVIEW
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-zinc-800 border border-black/[0.06] shadow-xs">
                  {current.badge}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {Object.entries(current.previewData).map(([k, v], idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-black/[0.04]">
                    <span className="text-zinc-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-bold text-zinc-950 text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-zinc-500 italic pt-1">
                Data flows deterministically into your store ledger and generates instant tax records.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
