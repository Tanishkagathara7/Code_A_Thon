'use client';

import React from 'react';
import { DotGridPatterns } from '@/components/background/DotGridPatterns';
import { FloatingSphere, OrganicBlob } from '@/components/background/EditorialShapes';
import { TechnicalCrosshair, TechnicalConnectingLine } from '@/components/background/TechnicalLinework';
import { BackgroundMotion } from '@/components/background/BackgroundMotion';
import { ArrowUpRight } from 'lucide-react';

/**
 * AuthOrbitalBackground
 * Refined layout ensuring 100% text clarity and natural, balanced composition:
 * - Moves all editorial text annotations and tags out of cramped corners into high-contrast, fully visible areas.
 * - Adds a delicate frosted glass pill behind the editorial telemetry text ("Zero sync drift verified.") so every single letter is crisp, legible, and never obscured by grid crosshairs or card edges.
 * - Positions the floating iridescent sphere and orbital geometry with plenty of breathing room.
 */
export const AuthOrbitalBackground: React.FC = () => {
  return (
    <>
      {/* Global SVG Gradients & Mask Patterns */}
      <DotGridPatterns />

      {/* Fixed Fullscreen Parallax Layer */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <BackgroundMotion>
          {/* =========================================================================
              TOP-RIGHT CANVAS FRAMING:
              - Sits above/behind the right card with ample spacing
              - Clean orbital arc with dual tone endpoints
              - Floating iridescent sphere with ambient float
             ========================================================================= */}
          <div className="hidden lg:block absolute top-24 right-4 xl:right-16 pointer-events-none">
            <div className="relative w-[480px] h-[480px]">
              {/* Sweeping Orbital Arc SVG */}
              <svg
                width="480"
                height="480"
                viewBox="0 0 480 480"
                className="overflow-visible"
              >
                {/* Primary orbital trajectory */}
                <circle
                  cx="240"
                  cy="240"
                  r="180"
                  fill="none"
                  stroke="rgba(32, 32, 82, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="5 7"
                />

                {/* Outer concentric subtle perimeter */}
                <circle
                  cx="240"
                  cy="240"
                  r="210"
                  fill="none"
                  stroke="rgba(32, 32, 82, 0.06)"
                  strokeWidth="0.75"
                />

                {/* Visible upper trajectory arc */}
                <path
                  d="M 60 240 A 180 180 0 0 1 420 240"
                  fill="none"
                  stroke="rgba(32, 32, 82, 0.18)"
                  strokeWidth="1.2"
                />

                {/* Node endpoints */}
                <circle cx="60" cy="240" r="3.5" fill="#38BDF8" />
                <circle cx="420" cy="240" r="4" fill="#F472B6" />
                <circle cx="420" cy="240" r="8" fill="none" stroke="#F472B6" strokeWidth="0.8" opacity="0.4" />

                {/* Subtle radial measurement ticks along upper half */}
                {[15, 45, 75, 105, 135, 165].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 240 + 180 * Math.cos(rad);
                  const y1 = 240 - 180 * Math.sin(rad);
                  const x2 = 240 + 188 * Math.cos(rad);
                  const y2 = 240 - 188 * Math.sin(rad);
                  return (
                    <line
                      key={deg}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(32, 32, 82, 0.18)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* Floating Iridescent Multi-Tone Sphere positioned at peak of the trajectory */}
              <div className="absolute top-4 left-[195px]">
                <FloatingSphere
                  size={92}
                  gradientId="sphere-cyan-pink"
                  className="editorial-float"
                />
              </div>

              {/* Crystal-clear pill badge: Fully readable text with frosted backdrop */}
              <div className="absolute top-[320px] right-2 xl:right-8">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.08] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                  <span className="font-serif italic text-zinc-700 text-xs tracking-wide">
                    Zero sync drift verified.
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 border-l border-zinc-200 pl-2">
                    CROSS-SURFACE TELEMETRY
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </div>
              </div>

              {/* Discrete vertical architectural coordinates tag */}
              <div className="hidden xl:block absolute top-20 right-0">
                <div
                  className="text-[10px] font-mono font-semibold tracking-[0.25em] text-zinc-400/80 uppercase"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  AUTH // KEYSTONE // 256-BIT
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM-LEFT CANVAS ANCHOR:
              Soft pastel lavender/mint atmospheric backdrop + precision arc
              Completely clear of the headline and Code-A-Thon visual frame.
             ========================================================================= */}
          <div className="hidden md:block absolute -bottom-20 -left-16 lg:left-2 opacity-70">
            <div className="relative w-[440px] h-[440px]">
              <OrganicBlob
                width={420}
                height={420}
                viewBox="0 0 540 540"
                path="M 270 20 C 410 20, 520 130, 520 270 C 520 410, 410 520, 270 520 C 130 520, 20 410, 20 270 C 20 130, 130 20, 270 20 Z"
                fill="url(#grad-pink-lavender)"
                opacity={0.35}
                className="editorial-float-slow"
              />

              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                className="absolute top-12 left-12 overflow-visible"
              >
                <circle
                  cx="140"
                  cy="160"
                  r="100"
                  fill="none"
                  stroke="rgba(32, 32, 82, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <path
                  d="M 40 160 A 100 100 0 0 1 240 160"
                  fill="none"
                  stroke="rgba(32, 32, 82, 0.16)"
                  strokeWidth="1"
                />
                <circle cx="40" cy="160" r="3" fill="#38BDF8" />
                <circle cx="240" cy="160" r="3" fill="#10B981" />
              </svg>

              {/* Micro crosshairs in corner */}
              <div className="absolute top-28 left-28 flex items-center gap-3">
                <TechnicalCrosshair size={10} color="#2563EB" />
                <TechnicalConnectingLine length={50} color="rgba(37, 99, 235, 0.2)" withArrow />
              </div>
            </div>
          </div>
        </BackgroundMotion>
      </div>
    </>
  );
};
