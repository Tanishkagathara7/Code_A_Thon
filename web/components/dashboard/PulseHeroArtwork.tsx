'use client';

import React from 'react';
import { Activity, ShieldCheck, Radio, Wifi, Zap } from 'lucide-react';

/**
 * PulseHeroArtwork
 * Original, high-impact SVG operational telemetry artwork for the Command Center hero.
 * Features:
 * - Multi-layered translucent spherical telemetry globe with longitude/latitude precision lines.
 * - Rotating orbital trajectory rings with live data nodes and pulsing signal emitters.
 * - Layered frosted glass telemetry telemetry status cards (Mesh Latency, Active Shards, Signal Waveform).
 * - Calibrated for high responsiveness across desktop, laptop, and tablet viewports.
 */
export const PulseHeroArtwork: React.FC = () => {
  return (
    <div className="relative w-full max-w-[440px] lg:max-w-[480px] xl:max-w-[520px] h-[320px] sm:h-[360px] lg:h-[380px] flex items-center justify-center select-none">
      {/* Ambient background soft glow layers */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#5B45F5]/20 via-[#38BDF8]/15 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-gradient-to-br from-[#18B981]/15 to-transparent blur-2xl pointer-events-none -z-10 translate-x-8 translate-y-8" />

      {/* SVG Core Operational Telemetry Matrix */}
      <svg
        viewBox="0 0 500 440"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-sphere-grad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#DCEBFF" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#EAE7FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="hero-ring-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B45F5" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#18B981" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="hero-ring-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
          </linearGradient>

          <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle technical calibration circles */}
        <circle
          cx="250"
          cy="210"
          r="190"
          stroke="#0A0A0A"
          strokeOpacity="0.06"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="250"
          cy="210"
          r="160"
          stroke="#5B45F5"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {/* Tilted Concentric Orbital Ellipses */}
        <g transform="rotate(-18 250 210)">
          {/* Main Primary Ring */}
          <ellipse
            cx="250"
            cy="210"
            rx="180"
            ry="68"
            stroke="url(#hero-ring-grad-1)"
            strokeWidth="2"
            strokeDasharray="12 4 2 4"
            className="origin-center"
          />

          {/* Active Data Nodes traveling on Main Ring */}
          <g>
            <circle cx="95" cy="180" r="5" fill="#5B45F5" filter="url(#hero-glow)" />
            <circle cx="95" cy="180" r="2.5" fill="#FFFFFF" />
            <circle cx="410" cy="235" r="4.5" fill="#18B981" />
            <circle cx="410" cy="235" r="2" fill="#FFFFFF" />
          </g>
        </g>

        {/* Counter-tilted Secondary Orbital Ring */}
        <g transform="rotate(32 250 210)">
          <ellipse
            cx="250"
            cy="210"
            rx="160"
            ry="54"
            stroke="url(#hero-ring-grad-2)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          {/* Secondary Data Node */}
          <circle cx="380" cy="200" r="4" fill="#38BDF8" />
          <circle cx="380" cy="200" r="2" fill="#FFFFFF" />
        </g>

        {/* Central Spherical Telemetry Object */}
        <g>
          {/* Base sphere backdrop with shadow */}
          <circle
            cx="250"
            cy="210"
            r="105"
            fill="url(#hero-sphere-grad)"
            stroke="#5B45F5"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />

          {/* Latitude Arcs */}
          <ellipse cx="250" cy="210" rx="105" ry="32" stroke="#5B45F5" strokeOpacity="0.18" strokeWidth="1" />
          <ellipse cx="250" cy="175" rx="98" ry="24" stroke="#5B45F5" strokeOpacity="0.14" strokeWidth="0.8" strokeDasharray="3 3" />
          <ellipse cx="250" cy="245" rx="98" ry="24" stroke="#5B45F5" strokeOpacity="0.14" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Longitude Arcs */}
          <ellipse cx="250" cy="210" rx="40" ry="105" stroke="#5B45F5" strokeOpacity="0.18" strokeWidth="1" />
          <ellipse cx="250" cy="210" rx="76" ry="105" stroke="#5B45F5" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="250" y1="105" x2="250" y2="315" stroke="#5B45F5" strokeOpacity="0.25" strokeWidth="1" />

          {/* Glowing Central Mesh Epicenter */}
          <circle cx="250" cy="210" r="12" fill="#5B45F5" fillOpacity="0.15" />
          <circle cx="250" cy="210" r="6" fill="#5B45F5" />
          <circle cx="250" cy="210" r="2.5" fill="#FFFFFF" />

          {/* Pulse Signal Waves Emitting from Center */}
          <circle
            cx="250"
            cy="210"
            r="28"
            stroke="#5B45F5"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            className="animate-ping origin-center"
            style={{ animationDuration: '3s' }}
          />
        </g>

        {/* Tangent Measurement Lines & Crosshairs */}
        <g stroke="#0A0A0A" strokeOpacity="0.2" strokeWidth="1">
          {/* Top-right pointer to mesh status */}
          <line x1="320" y1="140" x2="370" y2="90" />
          <line x1="370" y1="90" x2="430" y2="90" />
          <circle cx="320" cy="140" r="2.5" fill="#5B45F5" />

          {/* Bottom-left pointer */}
          <line x1="180" y1="280" x2="130" y2="330" />
          <line x1="130" y1="330" x2="70" y2="330" />
          <circle cx="180" cy="280" r="2.5" fill="#18B981" />
        </g>
      </svg>

      {/* Floating Translucent Operational Telemetry HUD Cards */}
      {/* 1. Top-Right Floating Telemetry Chip */}
      <div className="absolute -top-1 -right-2 sm:right-2 p-2.5 sm:p-3 rounded-2xl bg-[#FFFDF8]/90 backdrop-blur-md border border-[#E5E5E7] shadow-lg shadow-black/[0.04] flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-500 hover:scale-105 transition-transform">
        <div className="w-8 h-8 rounded-xl bg-[#F1F8F2] border border-[#18B981]/30 flex items-center justify-center text-[#18B981] shadow-2xs">
          <Wifi className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-[#687080] uppercase tracking-wider">
              Mesh Latency
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#18B981] animate-ping" />
          </div>
          <div className="text-xs font-black font-mono text-[#0A0A0A] flex items-baseline gap-1">
            <span>18.4ms</span>
            <span className="text-[9px] font-semibold text-[#18B981]">SYNC OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* 2. Bottom-Left Floating Subsystem Status Card */}
      <div className="absolute -bottom-2 -left-2 sm:left-2 p-2.5 sm:p-3 rounded-2xl bg-[#FFFDF8]/90 backdrop-blur-md border border-[#E5E5E7] shadow-lg shadow-black/[0.04] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-700 hover:scale-105 transition-transform">
        <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center shadow-xs">
          <Radio className="w-4 h-4 text-[#5B45F5] pulse-live-indicator" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-[#687080] uppercase tracking-wider">
              Telemetry Nodes
            </span>
          </div>
          <div className="text-xs font-black font-mono text-[#0A0A0A] flex items-baseline gap-1.5">
            <span className="text-[#5B45F5]">48 / 48</span>
            <span className="text-[9px] font-mono text-[#687080]">WEB & MOBILE</span>
          </div>
        </div>
      </div>

      {/* 3. Small Mini Sparkline Pill */}
      <div className="hidden sm:flex absolute bottom-8 right-6 px-2.5 py-1.5 rounded-xl bg-[#F4F7FB]/95 backdrop-blur-sm border border-[#5B45F5]/25 items-center gap-2 shadow-sm">
        <Activity className="w-3.5 h-3.5 text-[#5B45F5]" />
        <span className="text-[10px] font-mono font-bold text-zinc-800">
          WAVEFORM: ACTIVE
        </span>
      </div>
    </div>
  );
};
