'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely once on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standardized easing curves and timing constants
 */
export const MOTION = {
  ease: {
    smooth: 'power3.out',
    snappy: 'power2.out',
    dramatic: 'power4.out',
    editorial: 'expo.out',
  },
  duration: {
    quick: 0.45,
    standard: 0.75,
    extended: 1.0,
    deliberate: 1.25,
  },
  stagger: {
    tight: 0.06,
    standard: 0.1,
    loose: 0.16,
  },
} as const;

/**
 * Checks whether user prefers reduced motion
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks whether current viewport is a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 'ontouchstart' in window;
};

/**
 * Helper to split container into masked reveal lines safely without external dependencies
 */
export const initLineMaskReveal = (
  targets: Element[] | NodeListOf<Element> | string,
  options?: {
    yOffset?: number;
    stagger?: number;
    duration?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) => {
  if (isReducedMotion()) return null;

  const yOffset = options?.yOffset ?? 32;
  const stagger = options?.stagger ?? MOTION.stagger.standard;
  const duration = options?.duration ?? MOTION.duration.standard;

  return gsap.fromTo(
    targets,
    {
      y: yOffset,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: MOTION.ease.smooth,
      scrollTrigger: options?.scrollTrigger,
    }
  );
};
