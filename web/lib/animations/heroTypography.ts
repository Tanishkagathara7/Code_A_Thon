'use client';

import gsap from 'gsap';

export interface WordHighlightItem {
  id: string;
  word: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
}

export const HERO_WORD_SEQUENCE: WordHighlightItem[] = [
  {
    id: 'effortless',
    word: 'Effortless',
    bgColor: '#10B981',       // Soft Emerald
    textColor: '#FFFFFF',     // Crisp White
    borderColor: '#059669',
    shadowColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'gst',
    word: 'GST',
    bgColor: '#2563EB',       // Royal Blue
    textColor: '#FFFFFF',
    borderColor: '#1D4ED8',
    shadowColor: 'rgba(37, 99, 235, 0.35)',
  },
  {
    id: 'invoicing',
    word: 'Invoicing',
    bgColor: '#F59E0B',       // Amber
    textColor: '#FFFFFF',
    borderColor: '#D97706',
    shadowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'for',
    word: 'for',
    bgColor: '#6366F1',       // Indigo
    textColor: '#FFFFFF',
    borderColor: '#4F46E5',
    shadowColor: 'rgba(99, 102, 241, 0.35)',
  },
  {
    id: 'indian',
    word: 'Indian',
    bgColor: '#EC4899',       // Rose / Pink
    textColor: '#FFFFFF',
    borderColor: '#DB2777',
    shadowColor: 'rgba(236, 72, 153, 0.35)',
  },
  {
    id: 'retailers',
    word: 'Retailers',
    bgColor: '#10B981',       // Emerald
    textColor: '#FFFFFF',
    borderColor: '#059669',
    shadowColor: 'rgba(16, 185, 129, 0.35)',
  },
];

export const initHeroTypographyAnimation = (
  container: HTMLElement | null
): { cleanup: () => void } | null => {
  if (!container) return null;
  if (typeof window === 'undefined') return null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const wordBlocks = container.querySelectorAll<HTMLElement>('.hero-anim-word');
  if (!wordBlocks || wordBlocks.length === 0) return null;

  const masterTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.8,
    delay: 0.6, // Allow headline entrance reveal to land gracefully before kinetic cycle begins
    defaults: { ease: 'power2.out' },
  });

  wordBlocks.forEach((wordEl) => {
    const bgBlock = wordEl.querySelector<HTMLElement>('.word-highlight-bg');
    const textSpan = wordEl.querySelector<HTMLElement>('.word-text');
    if (!bgBlock || !textSpan) return;

    const targetTextColor = wordEl.getAttribute('data-text-color') || '#FFFFFF';
    const baseTextColor = wordEl.getAttribute('data-base-color') || '#09090B';

    const wordTl = gsap.timeline();

    wordTl
      .fromTo(
        bgBlock,
        {
          scale: 0.85,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        }
      )
      .to(
        textSpan,
        {
          color: targetTextColor,
          duration: 0.25,
          ease: 'power1.out',
        },
        '<0.05'
      )
      .to(
        bgBlock,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.35,
          delay: 1.1,
          ease: 'power2.in',
        }
      )
      .to(
        textSpan,
        {
          color: baseTextColor,
          duration: 0.3,
          ease: 'power1.in',
        },
        '<0.05'
      );

    masterTl.add(wordTl, '-=0.15');
  });

  return {
    cleanup: () => {
      masterTl.kill();
    },
  };
};
