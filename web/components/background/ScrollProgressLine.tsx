'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * ScrollProgressLine
 *
 * Precision scroll-progress bar fixed at the top of the viewport.
 *
 * Performance architecture:
 *  - NO React state — zero re-renders on scroll.
 *  - Uses `transform: scaleX()` (GPU-composited) instead of `width`
 *    so the browser never triggers layout or paint on scroll.
 *  - GSAP quickSetter provides the fastest possible DOM write path.
 *  - rAF throttle via `gsap.ticker` (already ticking for GSAP animations)
 *    keeps updates locked to the display refresh rate.
 */
export const ScrollProgressLine: React.FC = () => {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!fillRef.current) return;

    // quickSetter: the most performant GSAP DOM write — bypasses the full
    // tween pipeline and writes directly to the element's transform matrix.
    const setScaleX = gsap.quickSetter(fillRef.current, 'scaleX') as (v: number) => void;

    // Target value written by scroll handler; applied on next rAF tick.
    let targetProgress = 0;

    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        targetProgress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
      }
    };

    // Apply on every GSAP tick (≈ display refresh rate).
    // Light lerp (factor 0.18) smooths jitter from Lenis smooth-scroll
    // without introducing perceptible lag.
    let currentProgress = 0;
    const tick = () => {
      currentProgress += (targetProgress - currentProgress) * 0.18;
      setScaleX(currentProgress);
    };

    gsap.ticker.add(tick);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial state
    onScroll();

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none"
      style={{ height: '3px' }}
      aria-hidden="true"
    >
      {/* Subtle Track */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }} />

      {/* Fill — scaleX driven by GSAP quickSetter, origin left with neon blue-indigo gradient & glow */}
      <div
        ref={fillRef}
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500"
        style={{
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.7), 0 0 20px rgba(99, 102, 241, 0.4)',
        }}
      />
    </div>
  );
};
