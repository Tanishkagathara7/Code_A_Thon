'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      id: '01',
      question: 'How does VyaaparGST calculate intra-state vs. inter-state GST?',
      answer:
        'The tax engine compares your business operating state (e.g. Gujarat, State Code 24) with the customer’s place of supply state. If the buyer is also located in Gujarat, the item GST slab rate is divided 50:50 into Central Tax (CGST) and State Tax (SGST). If the buyer is located outside Gujarat (e.g. Maharashtra, State Code 27), the full GST percentage is applied as Integrated Tax (IGST) in accordance with Indian tax rules.',
    },
    {
      id: '02',
      question: 'Can I generate tax invoices for walk-in retail customers without a GSTIN?',
      answer:
        'Yes. The GSTIN field is completely optional. For retail counter B2C sales, simply provide the customer’s name and mobile number. The system generates a valid Tax Invoice with full itemized rates, HSN codes, and tax totals.',
    },
    {
      id: '03',
      question: 'Are saved invoices editable after generation?',
      answer:
        'To comply with statutory accounting requirements and prevent audit tampering, finalized invoices are saved immutably with sequential numbering (e.g. INV-2026-4749). If a correction is needed, shopkeepers can delete the draft record or issue a new bill.',
    },
    {
      id: '04',
      question: 'How does invoice printing and PDF export work?',
      answer:
        'Every bill is rendered in standard A4 portrait format with clean CSS print styles. Clicking "Print / Export PDF" launches the browser print dialog where you can save as a PDF or print directly to any office laser, inkjet, or thermal printer without extra software.',
    },
    {
      id: '05',
      question: 'Can I access VyaaparGST from any web browser or tablet?',
      answer:
        'Yes. VyaaparGST is built on Next.js and operates entirely in modern web browsers (Chrome, Edge, Safari, Firefox) on desktop monitors, laptops, and tablets. No manual software installation or database drivers are required.',
    },
    {
      id: '06',
      question: 'Which GST rate slabs are supported?',
      answer:
        'VyaaparGST natively supports standard Indian GST slabs: 0% (exempt goods), 5% (essentials/foodgrains), 12% (processed goods), 18% (electronics/general retail), and 28% (luxury items), with automatic calculation of taxable values and tax splits per line item.',
    },
  ];

  return (
    <div className="space-y-3 select-none">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id}
            className={`faq-accordion-item bento-card overflow-hidden transition-all duration-300 ${
              isOpen ? 'border-zinc-950/40 shadow-md ring-1 ring-zinc-950/10 bg-white' : 'hover:border-black/[0.14] bg-white/80'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xl"
            >
              <span className="text-base sm:text-lg tracking-tight">
                {faq.question}
              </span>
              <span
                className={`p-2 rounded-lg border border-black/[0.06] transition-transform duration-300 ${
                  isOpen
                    ? 'rotate-180 bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-zinc-50 text-zinc-500'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-black/[0.04]">
                  <div className="pt-4">{faq.answer}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
