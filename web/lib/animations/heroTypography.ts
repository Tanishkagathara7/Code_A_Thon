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
    id: 'precision',
    word: 'Precision',
    bgColor: '#2563EB',       // Vibrant Royal Blue
    textColor: '#FFFFFF',     // Crisp White
    borderColor: '#1D4ED8',
    shadowColor: 'rgba(37, 99, 235, 0.35)',
  },
  {
    id: 'operations',
    word: 'Operations',
    bgColor: '#EC4899',       // Vibrant Magenta / Pink
    textColor: '#FFFFFF',
    borderColor: '#DB2777',
    shadowColor: 'rgba(236, 72, 153, 0.35)',
  },
  {
    id: 'on-1',
    word: 'on',
    bgColor: '#10B981',       // Vibrant Emerald
    textColor: '#FFFFFF',
    borderColor: '#059669',
    shadowColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'desktop',
    word: 'Desktop',
    bgColor: '#F59E0B',       // Vibrant Amber / Gold
    textColor: '#FFFFFF',     // Pure White
    borderColor: '#D97706',
    shadowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'native',
    word: 'Native',
    bgColor: '#8B5CF6',       // Vibrant Purple / Violet
    textColor: '#FFFFFF',
    borderColor: '#7C3AED',
    shadowColor: 'rgba(139, 92, 246, 0.35)',
  },
  {
    id: 'velocity',
    word: 'Velocity',
    bgColor: '#EC4899',       // Vibrant Rose / Pink
    textColor: '#FFFFFF',
    borderColor: '#DB2777',
    shadowColor: 'rgba(236, 72, 153, 0.35)',
  },
  {
    id: 'on-2',
    word: 'on',
    bgColor: '#06B6D4',       // Vibrant Cyan
    textColor: '#FFFFFF',
    borderColor: '#0891B2',
    shadowColor: 'rgba(6, 182, 212, 0.35)',
  },
  {
    id: 'mobile',
    word: 'Mobile',
    bgColor: '#10B981',       // Vibrant Emerald
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
