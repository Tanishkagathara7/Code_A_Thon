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
      question: 'How is state synchronized between Next.js and React Native?',
      answer:
        'Both clients consume a unified Node.js / Express REST API backed by MongoDB Atlas. Authentication is maintained via cryptographically verified JWT tokens (stored in secure browser storage for web, and expo-secure-store for native mobile). Cache invalidation triggers immediate re-fetches for consistent operational metrics across both platforms.',
    },
    {
      id: '02',
      question: 'What AI gateway capabilities are natively integrated?',
      answer:
        'The shared backend incorporates OpenRouter AI Gateway integration. It executes structured entity summarization, priority classification, and action plan generation across your operations items with strict rate-limiting and token usage tracking.',
    },
    {
      id: '03',
      question: 'Can this architecture pivot to new hackathon problem statements?',
      answer:
        'Yes. The core data model is designed around extensible domain entities, automated file storage (via Multer), notification routing, and dynamic analytics. New domain attributes can be mapped in the shared contracts without altering the base cross-platform plumbing.',
    },
    {
      id: '04',
      question: 'Does the mobile application support native offline-first workflows?',
      answer:
        'Yes. The React Native Expo mobile client utilizes Reanimated 4.5.1 gesture handling, persistent secure credentials, local caching, and automated network detection to provide seamless mobile agility in spotty network environments.',
    },
    {
      id: '05',
      question: 'Is the web application production-ready and accessible?',
      answer:
        'The web client is built on Next.js App Router with strict WCAG AA contrast ratios, keyboard navigation, full semantic HTML5 elements, and dynamic client-side rendering with motion fallbacks for users preferring reduced motion.',
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
              isOpen ? 'border-blue-500/40 shadow-md ring-1 ring-blue-500/10' : 'hover:border-black/[0.14]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            >
              <span className="text-base sm:text-lg tracking-tight">
                {faq.question}
              </span>
              <span
                className={`p-2 rounded-lg border border-black/[0.06] transition-transform duration-300 ${
                  isOpen
                    ? 'rotate-180 bg-blue-50 text-blue-600 border-blue-200 shadow-xs'
                    : 'bg-zinc-50 text-zinc-500'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {/* Smooth CSS Grid Height Transition without layout jumps */}
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
