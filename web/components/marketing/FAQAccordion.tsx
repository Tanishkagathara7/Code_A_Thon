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
            className={`bento-card overflow-hidden transition-all duration-200 ${
              isOpen ? 'border-blue-500/30 shadow-md' : 'hover:border-black/[0.12]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 cursor-pointer"
            >
              <span className="text-base sm:text-lg tracking-tight">
                {faq.question}
              </span>
              <span
                className={`p-1.5 rounded-lg border border-black/[0.06] bg-zinc-50 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-blue-50 text-blue-600 border-blue-200' : 'text-zinc-500'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-black/[0.04]">
                <div className="pt-4">{faq.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
