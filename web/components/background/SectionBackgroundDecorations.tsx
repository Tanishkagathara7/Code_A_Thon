import React from 'react';
import { PrecisionArc } from './PrecisionArc';
import { NodeNetwork } from './NodeNetwork';
import { OrganicBlob, FloatingSphere, AccentDot } from './EditorialShapes';
import { TechnicalArc, TechnicalCrosshair, TechnicalConnectingLine } from './TechnicalLinework';
import { EditorialAnnotation, TechnicalTag, GeometricCluster } from './FloatingEditorialAccents';

/**
 * SectionBackgroundDecorations
 * Section-aware compositions covering sections 02 through 10:
 * - Sec 02: Architectural Philosophy (1400px - 2200px)
 * - Sec 03: Client Purpose & Parity (2200px - 3000px)
 * - Sec 04: Sync Corridor (3000px - 3900px) - Balanced bilateral network
 * - Sec 05: Operational Workflow Demo (3900px - 4700px) - Framing brackets & data flows
 * - Sec 06: Hackathon Heritage (4700px - 5600px) - Dynamic angular vectors & schematic framing
 * - Sec 07: Creator / Engineer (5600px - 6400px) - Focused editorial orbital frame
 * - Sec 08: Central Engine Topology (6400px - 7300px) - Rich technical node bus & route lines
 * - Sec 09: Technical FAQ (7300px - 8100px) - Clean alignment guides & structured matrix
 * - Sec 10 & Footer: Final CTA (8100px - End) - Grand closing convergence arcs
 */
export const SectionBackgroundDecorations: React.FC = () => {
  return (
    <>
      {/* =========================================================================
          SECTION 02 & 03: PHILOSOPHY & CLIENT PARITY (1400px - 3000px)
         ========================================================================= */}
      {/* Left: Pale mint organic shape with nested precision linework */}
      <div className="absolute top-[1360px] -left-36 lg:-left-24 xl:-left-12">
        <OrganicBlob
          width={480}
          height={480}
          viewBox="0 0 480 480"
          path="M 120 80 C 240 20, 380 70, 420 180 C 460 290, 390 410, 260 440 C 130 470, 50 370, 40 260 C 30 150, 60 110, 120 80 Z"
          fill="url(#grad-blue-mint)"
          opacity={0.45}
          className="editorial-float"
        />
      </div>

      {/* Left Philosophy Linework: Clean mathematical arc */}
      <div className="hidden md:block absolute top-[1440px] left-4 lg:left-12 xl:left-24">
        <PrecisionArc
          width={340}
          height={340}
          viewBox="0 0 340 340"
          cx={170}
          cy={170}
          radius={140}
          startAngle={220}
          endAngle={380}
          strokeColor="rgba(32, 32, 82, 0.16)"
          showTicks
          tickCount={8}
          startNodeColor="#2563EB"
          endNodeColor="#10B981"
        />
      </div>

      {/* Left Crosshair Cluster */}
      <div className="hidden lg:flex flex-col gap-6 absolute top-[1660px] left-12 xl:left-24">
        <TechnicalCrosshair size={12} color="#2563EB" />
        <TechnicalConnectingLine length={90} vertical color="rgba(37, 99, 235, 0.25)" withArrow />
        <TechnicalCrosshair size={10} color="#059669" />
      </div>

      {/* Right Section 03 Parity: Elegant nested precision concentric reticle */}
      <div className="hidden lg:block absolute top-[2160px] right-6 xl:right-16">
        <PrecisionArc
          width={320}
          height={320}
          viewBox="0 0 320 320"
          cx={160}
          cy={160}
          radius={130}
          startAngle={180}
          endAngle={360}
          secondaryRadius={95}
          secondaryDasharray="3 6"
          showCenterCrosshair
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#38BDF8"
          endNodeColor="#10B981"
        />
      </div>

      {/* Right Mint Dot Grid with Soft Edge Mask */}
      <div
        className="hidden lg:block absolute top-[2420px] right-6 xl:right-20 w-44 h-32 opacity-75"
        style={{ maskImage: 'radial-gradient(ellipse, black 40%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse, black 40%, transparent 75%)' }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#editorial-dot-grid-mint)" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 04: SYNCHRONIZATION CORRIDOR (3000px - 3900px)
          Bilateral balanced linework tying the two sync cards together
         ========================================================================= */}
      {/* Left: Soft lavender shape with nested arcs */}
      <div className="absolute top-[3050px] -left-28 lg:-left-16 xl:left-0">
        <OrganicBlob
          width={450}
          height={450}
          viewBox="0 0 450 450"
          path="M 225 30 C 340 30, 420 110, 420 225 C 420 340, 340 420, 225 420 C 110 420, 30 340, 30 225 C 30 110, 110 30, 225 30 Z"
          fill="url(#grad-pink-lavender)"
          opacity={0.42}
          className="editorial-float-slow"
        />
      </div>

      {/* Left Sync Linework */}
      <div className="hidden md:block absolute top-[3180px] left-6 lg:left-14 xl:left-24">
        <PrecisionArc
          width={320}
          height={320}
          viewBox="0 0 320 320"
          cx={60}
          cy={160}
          radius={140}
          startAngle={30}
          endAngle={150}
          secondaryRadius={120}
          secondaryDasharray="3 5"
          showTicks
          tickCount={8}
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#8B5CF6"
          endNodeColor="#2563EB"
        />
      </div>

      {/* Right Sync Corridor Linework (Restoring balance!) */}
      <div className="hidden md:block absolute top-[3160px] -right-12 lg:right-4 xl:right-16">
        <PrecisionArc
          width={340}
          height={340}
          viewBox="0 0 340 340"
          cx={260}
          cy={170}
          radius={150}
          startAngle={190}
          endAngle={320}
          secondaryRadius={130}
          secondaryDasharray="3 5"
          showTicks
          tickCount={9}
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#10B981"
          endNodeColor="#EC4899"
        />
      </div>

      {/* Right Diagonal Hatch Pattern Tile */}
      <div className="hidden lg:block absolute top-[3380px] right-14 xl:right-28 w-32 h-32 opacity-70" style={{ maskImage: 'radial-gradient(circle, black 35%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 70%)' }}>
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#editorial-diagonal-hatch)" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 05: OPERATIONAL WORKFLOW DEMO (3900px - 4700px)
         ========================================================================= */}
      {/* Left Data-flow alignment guide */}
      <div className="hidden lg:flex flex-col gap-4 absolute top-[4100px] left-10 xl:left-24">
        <TechnicalConnectingLine length={120} vertical color="rgba(32, 32, 82, 0.18)" withArrow />
        <TechnicalTag label="PAYLOAD PIPELINE // JSON" className="text-zinc-600 dark:text-zinc-300" />
      </div>

      {/* Right Soft Blue Shape - Pushed far to viewport gutter so it never touches or overlays cards */}
      <div className="hidden xl:block absolute top-[4180px] -right-48 2xl:-right-24 opacity-60">
        <OrganicBlob
          width={380}
          height={380}
          viewBox="0 0 380 380"
          path="M 190 30 C 290 30, 350 110, 350 200 C 350 290, 260 350, 160 350 C 70 350, 30 270, 30 170 C 30 80, 100 30, 190 30 Z"
          fill="url(#grad-blue-lavender)"
          opacity={0.35}
        />
      </div>

      {/* =========================================================================
          SECTION 06: HACKATHON HERITAGE (4700px - 5600px)
         ========================================================================= */}
      {/* Left Ochre / Amber Hackathon Flare */}
      <div className="absolute top-[4850px] -left-28 lg:-left-12">
        <OrganicBlob
          width={420}
          height={420}
          viewBox="0 0 420 420"
          path="M 180 40 C 290 20, 390 100, 390 210 C 390 320, 300 390, 190 390 C 80 390, 30 300, 30 190 C 30 80, 80 50, 180 40 Z"
          fill="url(#grad-mint-ochre)"
          opacity={0.42}
        />
      </div>

      {/* Left Lightning / Vector Accent Marker */}
      <div className="hidden lg:block absolute top-[5020px] left-14 xl:left-26">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <path
            d="M 22 4 L 8 28 L 20 28 L 14 54 L 32 24 L 20 24 Z"
            fill="#F59E0B"
            fillOpacity="0.4"
            stroke="#D97706"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Right Hackathon Diagram Framing Arc */}
      <div className="hidden md:block absolute top-[4900px] -right-16 lg:right-2 xl:right-14">
        <PrecisionArc
          width={360}
          height={360}
          viewBox="0 0 360 360"
          cx={280}
          cy={180}
          radius={160}
          startAngle={180}
          endAngle={330}
          strokeColor="rgba(245, 158, 11, 0.2)"
          showTicks
          tickCount={10}
          startNodeColor="#F59E0B"
          endNodeColor="#D97706"
        />
      </div>

      {/* =========================================================================
          SECTION 07: CREATOR / ENGINEER PROFILE (5600px - 6400px)
         ========================================================================= */}
      {/* Left Portrait Supporting Arc */}
      <div className="hidden md:block absolute top-[5750px] left-6 lg:left-14 xl:left-24">
        <PrecisionArc
          width={320}
          height={320}
          viewBox="0 0 320 320"
          cx={60}
          cy={160}
          radius={130}
          startAngle={20}
          endAngle={160}
          secondaryRadius={110}
          secondaryDasharray="2 4"
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#EC4899"
          endNodeColor="#3B82F6"
        />
      </div>

      {/* Right Editorial Callout */}
      <div className="hidden xl:block absolute top-[5920px] right-14">
        <EditorialAnnotation
          text="Build. Learn. Ship. Repeat."
          subtext="Continuous refinement"
          rotation="-rotate-6"
        />
      </div>

      {/* =========================================================================
          SECTION 08: TOPOLOGY ARCHITECTURE (6400px - 7300px)
          Pushed to side gutters to cleanly frame the section without overlapping cards
         ========================================================================= */}
      {/* Left Topology Multi-Node Bus System - Far left margin */}
      <div className="hidden 2xl:block absolute top-[6480px] -left-12 2xl:left-4 opacity-75">
        <NodeNetwork
          width={260}
          height={180}
          viewBox="0 0 260 180"
          nodes={[
            { id: 'edge-1', x: 30, y: 35, color: '#059669', radius: 3 },
            { id: 'edge-2', x: 30, y: 90, color: '#2563EB', radius: 3 },
            { id: 'edge-3', x: 30, y: 145, color: '#8B5CF6', radius: 3 },
            { id: 'hub', x: 140, y: 90, color: '#09090B', radius: 4, pulse: true },
            { id: 'db', x: 210, y: 90, color: '#10B981', radius: 3.5 },
          ]}
          connections={[
            { from: 'edge-1', to: 'hub', dashed: true, color: 'rgba(5, 150, 105, 0.35)' },
            { from: 'edge-2', to: 'hub', dashed: false, color: 'rgba(37, 99, 235, 0.35)' },
            { from: 'edge-3', to: 'hub', dashed: true, color: 'rgba(139, 92, 246, 0.35)' },
            { from: 'hub', to: 'db', dashed: false, color: 'rgba(16, 185, 129, 0.45)', strokeWidth: 1.5 },
          ]}
        />
      </div>

      {/* Right Topology Linework - Far right margin */}
      <div className="hidden 2xl:block absolute top-[6520px] -right-28 2xl:-right-8 opacity-75">
        <PrecisionArc
          width={340}
          height={340}
          viewBox="0 0 340 340"
          cx={280}
          cy={170}
          radius={150}
          startAngle={190}
          endAngle={340}
          secondaryRadius={125}
          secondaryDasharray="3 6"
          strokeColor="rgba(32, 32, 82, 0.16)"
          startNodeColor="#3B82F6"
          endNodeColor="#10B981"
        />
      </div>

      {/* =========================================================================
          SECTION 09: FREQUENTLY ASKED QUESTIONS (7300px - 8100px)
          Calm, balanced alignment grid & subtle vertical connector guides
         ========================================================================= */}
      {/* Left Cross-Grid Tile */}
      <div
        className="hidden lg:block absolute top-[7420px] left-8 xl:left-24 w-40 h-40 opacity-70"
        style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)' }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#editorial-cross-grid)" />
        </svg>
      </div>

      {/* Right Lavender Blob near FAQ */}
      <div className="absolute top-[7500px] -right-24 lg:-right-10 xl:right-8">
        <OrganicBlob
          width={440}
          height={440}
          viewBox="0 0 440 440"
          path="M 220 40 C 330 40, 400 120, 400 220 C 400 330, 320 400, 210 400 C 100 400, 40 320, 40 210 C 40 100, 110 40, 220 40 Z"
          fill="url(#grad-ochre-pink)"
          opacity={0.42}
        />
      </div>

      {/* Right Editorial Note near FAQ */}
      <div className="hidden xl:block absolute top-[7620px] right-16">
        <EditorialAnnotation
          text="Good Questions. Better Builders."
          subtext="Developer accessibility"
          rotation="rotate-6"
        />
      </div>

      {/* =========================================================================
          SECTION 10 & FOOTER: FINAL CTA (8100px - End)
          Grand closing orbital convergence echoing Section 01
         ========================================================================= */}
      {/* Left Dual concentric spheres and accent note */}
      <div className="hidden md:block absolute bottom-52 -left-12 lg:left-8 xl:left-20">
        <FloatingSphere size={95} gradientId="sphere-mint-blue" className="editorial-float" />
      </div>

      <div className="hidden lg:block absolute bottom-80 left-24">
        <EditorialAnnotation
          text="Different Devices. Same Vision."
          rotation="-rotate-6"
        />
      </div>

      {/* Right: Sweeping closing arc and soft pink glow */}
      <div className="absolute bottom-24 -right-28 lg:-right-12 xl:right-4">
        <OrganicBlob
          width={500}
          height={500}
          viewBox="0 0 500 500"
          path="M 250 40 C 380 40, 460 140, 460 250 C 460 380, 360 460, 240 460 C 120 460, 40 360, 40 240 C 40 120, 130 40, 250 40 Z"
          fill="url(#grad-pink-lavender)"
          opacity={0.42}
        />
      </div>

      <div className="hidden md:block absolute bottom-44 right-6 lg:right-16 xl:right-24">
        <PrecisionArc
          width={400}
          height={400}
          viewBox="0 0 400 400"
          cx={280}
          cy={280}
          radius={220}
          startAngle={190}
          endAngle={340}
          secondaryRadius={190}
          secondaryDasharray="4 6"
          showTicks
          tickCount={14}
          strokeColor="rgba(32, 32, 82, 0.18)"
          startNodeColor="#38BDF8"
          endNodeColor="#EC4899"
        />
      </div>
    </>
  );
};
