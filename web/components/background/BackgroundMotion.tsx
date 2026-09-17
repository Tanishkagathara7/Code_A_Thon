'use client';

import React, { useEffect, useRef } from 'react';

/**
 * BackgroundMotion
 * Adds a restrained, high-end desktop mouse parallax shift to decorative background layers.
 * - Interpolated with requestAnimationFrame lerp (factor 0.05) to eliminate any stutter or jitter.
 * - Max shift capped at 16px to prevent distracting movement behind text.
 * - Fully disabled on touch devices and for users with prefers-reduced-motion.
 */
export const BackgroundMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict checks: reduced motion or touch devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized offset from center (-1 to 1)
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;

      // Small max translation distance: 16px
      targetX.current = nx * 16;
      targetY.current = ny * 12;
    };

    const renderLoop = () => {
      // Smooth lerp
      currentX.current += (targetX.current - currentX.current) * 0.05;
      currentY.current += (targetY.current - currentY.current) * 0.05;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current.toFixed(2)}px, ${currentY.current.toFixed(2)}px, 0)`;
      }

      animFrameId.current = window.requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animFrameId.current = window.requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) {
        window.cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full will-change-transform transition-transform duration-75 ease-out"
    >
      {children}
    </div>
  );
};
