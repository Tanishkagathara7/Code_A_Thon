import React from 'react';
import { PrecisionArc } from './PrecisionArc';
import { OrganicBlob, FloatingSphere } from './EditorialShapes';
import { EditorialAnnotation, TechnicalTag } from './FloatingEditorialAccents';

/**
 * HeroOrbitalSystem
 * The visual anchor for Section 01 (Hero & Product Showcase).
 * Carefully balanced left vs. right composition:
 * - Left side: Layered soft organic form, concentric mathematical orbital arcs,
 *   masked dot grid matrix, and vertical system orientation tag.
 * - Right side: Sweeping orbital trajectory extending past viewport boundary,
 *   tangent measurement ticks, dual accent sphere with subtle ambient glow,
 *   and editorial handwritten callout.
 */
export const HeroOrbitalSystem: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 right-0 h-[1450px] overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* =========================================================================
          HERO LEFT COMPOSITION: Organic foundation + Concentric Orbital Arcs
         ========================================================================= */}
      {/* 1. Large cropped soft pastel form */}
      <div className="absolute top-10 -left-32 sm:-left-24 lg:-left-16 xl:-left-8 opacity-75">
        <OrganicBlob
          width={540}
          height={540}
          viewBox="0 0 540 540"
          path="M 270 20 C 410 20, 520 130, 520 270 C 520 410, 410 520, 270 520 C 130 520, 20 410, 20 270 C 20 130, 130 20, 270 20 Z"
          fill="url(#grad-pink-lavender)"
          opacity={0.48}
          className="editorial-float-slow"
        />
      </div>

      {/* 2. Concentric Precision Arcs (Left Gutter) */}
      <div className="hidden md:block absolute top-24 left-2 lg:left-8 xl:left-20">
        <PrecisionArc
          width={420}
          height={420}
          viewBox="0 0 420 420"
          cx={60}
          cy={210}
          radius={190}
          startAngle={10}
          endAngle={170}
          secondaryRadius={160}
          secondaryDasharray="4 6"
          showTicks
          tickCount={14}
          tickLength={6}
          showCenterCrosshair
          strokeColor="rgba(32, 32, 82, 0.18)"
          startNodeColor="#38BDF8"
          endNodeColor="#2563EB"
        />
      </div>

      {/* 3. Left Masked Dot Grid Block with Radial Falloff */}
      <div className="hidden lg:block absolute top-80 left-8 xl:left-24 w-44 h-44 opacity-80" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)' }}>
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#editorial-dot-grid)" />
        </svg>
      </div>

      {/* 4. Left Vertical Architectural Tag */}
      <div className="hidden xl:block absolute top-72 left-10">
        <TechnicalTag
          label="HYDRATION // DESKTOP // ZERO-DRIFT"
          vertical
          className="text-zinc-600 dark:text-zinc-300"
        />
      </div>

      {/* =========================================================================
          HERO RIGHT COMPOSITION: Trajectory Sweep + Multi-Tone Sphere + Note
         ========================================================================= */}
      {/* 1. Large sweeping orbital trajectory line extending beyond viewport */}
      <div className="hidden md:block absolute top-12 -right-16 lg:right-0 xl:right-12">
        <PrecisionArc
          width={480}
          height={480}
          viewBox="0 0 480 480"
          cx={380}
          cy={240}
          radius={230}
          startAngle={190}
          endAngle={350}
          showTicks
          tickCount={16}
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#F472B6"
          endNodeColor="#10B981"
        />
      </div>

      {/* 2. Floating Dual-Tone Sphere */}
      <div className="hidden md:block absolute top-28 -right-14 lg:right-6 xl:right-24">
        <FloatingSphere size={105} gradientId="sphere-cyan-pink" className="editorial-float" />
      </div>

      {/* 3. Handwritten Editorial Sticky Note */}
      <div className="hidden lg:block absolute top-[430px] right-8 xl:right-20">
        <EditorialAnnotation
          text="Zero sync drift verified."
          subtext="Cross-Surface Telemetry"
          rotation="-rotate-2"
          withArrow
        />
      </div>



      {/* Tablet Showcase Surrounding Annotations */}
      <div className="hidden xl:block absolute top-[720px] left-10">
        <EditorialAnnotation
          text="Same power. Every screen."
          subtext="Desktop & Mobile Parity"
          rotation="rotate-3"
        />
      </div>
      <div className="hidden lg:block absolute top-[940px] right-8 xl:right-16">
        <TechnicalTag
          label="REST API // MONGOOSE ATOMIC"
          vertical
          className="text-zinc-600 dark:text-zinc-300"
        />
      </div>
    </div>
  );
};
