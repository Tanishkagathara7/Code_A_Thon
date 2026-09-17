'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export const initLenis = (): Lenis | null => {
  if (typeof window === 'undefined') return null;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  lenisInstance = lenis;

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
};

export const pauseLenis = () => {
  if (lenisInstance) {
    lenisInstance.stop();
  }
};

export const resumeLenis = () => {
  if (lenisInstance) {
    lenisInstance.start();
  }
};

export const scrollTo = (
  target: string | HTMLElement | number,
  options?: { offset?: number; immediate?: boolean; duration?: number }
) => {
  if (typeof window === 'undefined') return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset || 0);
        window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  }
};

export const destroyLenis = () => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

