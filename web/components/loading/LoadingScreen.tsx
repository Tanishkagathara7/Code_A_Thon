'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLoading } from '@/lib/context/LoadingContext';
import { domainConfig } from '@/lib/domain.config';
import { isReducedMotion } from '@/lib/animations/motionSystem';
import LoadingLines from '@/components/ui/loading-lines';

interface LoadingScreenProps {
  onExitComplete?: () => void;
  standalone?: boolean;
  isReady?: boolean;
  onComplete?: () => void;
  statusMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onExitComplete,
  standalone = false,
  isReady: standaloneReady,
  onComplete,
  statusMessage,
}) => {
  const contextLoading = useLoading();
  const isLoading = standalone ? true : contextLoading.isLoading;
  const isReady = standalone ? Boolean(standaloneReady) : contextLoading.isReady;
  const completeLoading = standalone ? (onComplete || (() => {})) : contextLoading.completeLoading;

  const containerRef   = useRef<HTMLDivElement>(null);
  const numberRef      = useRef<HTMLSpanElement>(null);

  /**
   * Store the entrance TIMELINE (not context) in a ref.
   * This lets the exit effect call .kill() — which freezes the animation
   * at its current state — instead of .revert() which snaps values back
   * to their "from" state (the bug that caused counter to jump back to 60).
   */
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);

  /** Shared counter value bridging entrance → exit */
  const counterValRef = useRef<number>(0);

  // ─────────────────────────────────────────────────────────────────
  // ENTRANCE ANIMATION
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isReducedMotion()) return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    entranceTlRef.current = tl;

    // 1. Number drifts up + fades in
    tl.fromTo(
      numberRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // 2. Counter ticks 00 → 60
    const obj = { val: 0 };

    tl.to(
      obj,
      {
        val: 60,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate() {
          const v = Math.round(obj.val);
          counterValRef.current = v;
          if (numberRef.current) {
            numberRef.current.textContent = `${v}%`;
          }
        },
      },
      '-=0.2'
    );

    return () => {
      /**
       * CRITICAL: use .kill(), NOT .revert().
       * kill() stops the animation and leaves all animated properties at
       * their current values — the number stays wherever it reached.
       * revert() would snap everything back to the "from" state, causing
       * the counter to jump (the original bug).
       */
      tl.kill();
      entranceTlRef.current = null;
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // EXIT ANIMATION  (fires when isReady becomes true)
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    if (isReducedMotion()) {
      completeLoading();
      onExitComplete?.();
      return;
    }

    /**
     * Kill the entrance animation exactly where it stopped.
     * Must happen BEFORE starting the exit so they don't conflict.
     */
    if (entranceTlRef.current) {
      entranceTlRef.current.kill();
      entranceTlRef.current = null;
    }

    let completed = false;

    const exitCtx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete() {
          completed = true;
          completeLoading();
          onExitComplete?.();
        },
      });

      // 1. Counter ticks to 100%
      const obj = { val: counterValRef.current };

      tl.to(
        obj,
        {
          val: 100,
          duration: 0.42,
          ease: 'power2.inOut',
          onUpdate() {
            const v = Math.round(obj.val);
            counterValRef.current = v;
            if (numberRef.current) {
              numberRef.current.textContent = `${v}%`;
            }
          },
        }
      );

      // 2. Hold at 100% — lets the eye register completion
      tl.to({}, { duration: 0.14 });

      // 3. Upward wipe — reveals the landing page beneath
      tl.to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.72,
        ease: 'power3.inOut',
      });
    }, containerRef);

    return () => {
      // Only revert if onComplete never fired
      if (!completed) exitCtx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col select-none overflow-hidden"
      style={{ backgroundColor: '#F7F5EF', clipPath: 'inset(0 0 0% 0)' }}
    >
      {/*
        ── FOCAL POINT ──────────────────────────────────────────────────
        Animated LoadingLines typography + percentage counter
      */}
      <div
        className="flex-1 flex flex-col items-center justify-center gap-6"
        style={{ paddingTop: '2vh' }}
        aria-hidden="true"
      >
        <div className="transform transition-transform duration-500">
          <LoadingLines />
        </div>

        <span
          ref={numberRef}
          className="tabular-nums leading-none text-zinc-900"
          style={{
            fontSize: 'clamp(56px, 12vw, 110px)',
            fontWeight: 200,
            letterSpacing: '-0.03em',
            opacity: 0,
          }}
        >
          0%
        </span>

        {statusMessage && (
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest pt-2 animate-pulse">
            {statusMessage}
          </p>
        )}
      </div>



    </div>
  );
};
