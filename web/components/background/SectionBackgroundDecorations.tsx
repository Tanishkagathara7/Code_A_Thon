import React from 'react';
import { PrecisionArc } from './PrecisionArc';
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
        className="hidden lg:block absolute top-[7420px] left-8 xl:left-24 w-44 h-44 opacity-70"
        style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)' }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#editorial-cross-grid)" />
        </svg>
      </div>

      {/* Left Mathematical Inquiry Arc Framing FAQ */}
      <div className="hidden md:block absolute top-[7340px] left-2 lg:left-10 xl:left-20">
        <PrecisionArc
          width={340}
          height={340}
          viewBox="0 0 340 340"
          cx={70}
          cy={170}
          radius={145}
          startAngle={25}
          endAngle={155}
          secondaryRadius={125}
          secondaryDasharray="3 5"
          showTicks
          tickCount={9}
          strokeColor="rgba(32, 32, 82, 0.18)"
          startNodeColor="#6366F1"
          endNodeColor="#EC4899"
          tagLabel="INQUIRY BUS // RESOLUTION"
          tagSubtext="09.KNOWLEDGE_BASE"
        />
      </div>

      {/* Left Technical Crosshairs & Telemetry Label */}
      <div className="hidden xl:flex flex-col gap-3 absolute top-[7590px] left-16 2xl:left-28">
        <div className="flex items-center gap-3">
          <TechnicalCrosshair size={10} color="#6366F1" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">INDEX_TREE_VALIDATED</span>
        </div>
        <TechnicalConnectingLine length={70} vertical color="rgba(99, 102, 241, 0.25)" />
      </div>

      {/* Right Soft Ochre-Pink Blob near FAQ */}
      <div className="absolute top-[7440px] -right-24 lg:-right-10 xl:right-8">
        <OrganicBlob
          width={460}
          height={460}
          viewBox="0 0 460 460"
          path="M 230 40 C 345 40, 420 120, 420 230 C 420 345, 335 420, 220 420 C 105 420, 40 335, 40 220 C 40 105, 115 40, 230 40 Z"
          fill="url(#grad-ochre-pink)"
          opacity={0.44}
          className="editorial-float-slow"
        />
      </div>

      {/* Right Gentle Floating Accent Sphere */}
      <div className="hidden md:block absolute top-[7480px] right-24 xl:right-40">
        <FloatingSphere size={52} gradientId="sphere-cyan-pink" className="editorial-float" />
      </div>

      {/* Right Editorial Note & Query Tag */}
      <div className="hidden xl:block absolute top-[7620px] right-14 2xl:right-24">
        <EditorialAnnotation
          text="Good Questions. Better Builders."
          subtext="Developer accessibility // v2.4"
          rotation="rotate-6"
          withArrow
        />
        <div className="mt-3 flex items-center gap-2">
          <AccentDot size={6} color="#EC4899" pulse />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">STATE: UNROLLED_FAQ</span>
        </div>
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
