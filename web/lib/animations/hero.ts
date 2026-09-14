'use client';

import gsap from 'gsap';

export const createHeroEntranceTimeline = (container: HTMLElement | null) => {
  if (!container) return null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });

    // Eyebrow badge entrance (if present)
    if (container.querySelector('.hero-eyebrow')) {
      tl.fromTo(
        '.hero-eyebrow',
        { y: -12, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 }
      );
    }

    // Headline reveal line by line
    tl.fromTo(
      '.hero-headline-1',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.2'
    );

    tl.fromTo(
      '.hero-headline-2',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.35'
    );

    tl.fromTo(
      '.hero-headline-3',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.35'
    );

    // Supporting copy reveals
    tl.fromTo(
      '.hero-copy',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.3'
    );

    // CTA buttons reveal
    tl.fromTo(
      '.hero-cta',
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.45 },
      '-=0.25'
    );

    // Technical verification strip appears (if present)
    if (container.querySelector('.hero-metadata')) {
      tl.fromTo(
        '.hero-metadata',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      );
    }

    // Product visual enters smoothly with realistic elevation
    tl.fromTo(
      '.hero-product-stage',
      { y: 36, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out' },
      '-=0.3'
    );
  }, container);

  return ctx;
};
