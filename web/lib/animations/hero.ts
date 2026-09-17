'use client';

import gsap from 'gsap';
import { MOTION, isReducedMotion } from './motionSystem';

/**
 * createHeroEntranceTimeline
 * Establishes a cohesive editorial entrance for navigation, headline lines, copy, buttons, and tablet stage.
 */
export const createHeroEntranceTimeline = (container: HTMLElement | null) => {
  if (!container || typeof window === 'undefined') return null;
  if (isReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: MOTION.ease.smooth, duration: MOTION.duration.standard },
    });

    // 1. Eyebrow badge entrance
    const eyebrow = container.querySelector('.hero-eyebrow');
    if (eyebrow) {
      tl.fromTo(
        eyebrow,
        { y: -12, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: MOTION.ease.snappy }
      );
    }

    // 2. Headline masked line-by-line reveal
    tl.fromTo(
      '.hero-headline-1',
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      eyebrow ? '-=0.2' : '0'
    );

    tl.fromTo(
      '.hero-headline-2',
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      '-=0.55'
    );

    tl.fromTo(
      '.hero-headline-3',
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      '-=0.55'
    );

    // 3. Supporting editorial copy
    tl.fromTo(
      '.hero-copy',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.45'
    );

    // 4. CTA wrapper — animate the container (opacity:0 inline style is on .hero-cta div)
    tl.fromTo(
      '.hero-cta',
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: MOTION.ease.smooth,
      },
      '-=0.35'
    );

    // 5. Tablet mockup elevation into the stage
    tl.fromTo(
      '.hero-product-stage',
      { y: 40, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: MOTION.ease.smooth,
      },
      '-=0.3'
    );
  }, container);

  return ctx;
};
