'use client';

import React from 'react';
import { DotGridPatterns } from './DotGridPatterns';
import { HeroOrbitalSystem } from './HeroOrbitalSystem';
import { SectionBackgroundDecorations } from './SectionBackgroundDecorations';
import { BackgroundMotion } from './BackgroundMotion';
import { InteractiveGridTiles } from '@/components/auth/InteractiveGridTiles';

/**
 * EditorialBackgroundSystem
 * The master orchestrator for the premium animated engineering background experience:
 * - Layer 1: Global interactive cursor-reactive neon tile grid & tech crosshairs (InteractiveGridTiles)
 * - Layer 2: Ambient architectural hairline grid with intersection dots (TechnicalGrid)
 * - Layer 3: Desktop RAF-lerped gentle mouse parallax wrapper (BackgroundMotion)
 * - Layer 4: HeroOrbitalSystem (Concentric precision arcs, trajectory sweeps, masked matrices)
 * - Layer 5: SectionBackgroundDecorations (Sections 02 to 10 tailored compositions)
 * - Layer 6: Horizontal architectural progress line (ScrollProgressLine)
 * - Pointer-events: none to guarantee zero interference with interactive page elements
 */
export const EditorialBackgroundSystem: React.FC = () => {
  return (
    <>
      {/* 1. Global SVG Pattern Definitions, Radial Masks & Gradients */}
      <DotGridPatterns />

      {/* 2. Global Full-Page Cursor Reactive Interactive Grid Tiles (Original Effect) */}
      <InteractiveGridTiles tileSize={40} fixed className="z-0" />

      {/* 4. Full-Page Decorative Layer with Subtle Parallax */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        {/* Desktop Mouse Motion Parallax Wrapper */}
        <BackgroundMotion>
          {/* Section 01: Hero & Product Showcase Orbital System */}
          <HeroOrbitalSystem />

          {/* Sections 02 through 10: Tailored Visual Narrative */}
          <SectionBackgroundDecorations />
        </BackgroundMotion>
      </div>
    </>
  );
};

