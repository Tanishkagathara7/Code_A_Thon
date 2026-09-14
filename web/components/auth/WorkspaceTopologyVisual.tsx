'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, ShieldCheck, RefreshCw, KeyRound, Cpu } from 'lucide-react';

interface WorkspaceTopologyVisualProps {
  mode?: 'signin' | 'signup' | 'reset';
  className?: string;
}

export const WorkspaceTopologyVisual: React.FC<WorkspaceTopologyVisualProps> = ({
  mode = 'signin',
  className = '',
}) => {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl border border-black/[0.08] bg-white/70 backdrop-blur-md p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-700 ${className}`}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient subtle light glow - adapts based on mode */}
      <div
        className={`absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${
          mode === 'signup' ? 'bg-emerald-500/10' : 'bg-blue-600/10'
        }`}
      />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-zinc-900/5 rounded-full blur-2xl pointer-events-none" />

      {/* Visual Header / Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-black/[0.06] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                mode === 'signup' ? 'bg-emerald-400' : 'bg-blue-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                mode === 'signup' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            />
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-700">
            {mode === 'signup' ? 'Workspace Provisioning Mesh' : 'Dual-Client Sync Topology'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-600 border border-black/[0.04]">
            LATENCY: 12ms
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-600 border border-black/[0.04]">
            ED25519
          </span>
        </div>
      </div>

      {/* Visual Architecture Diagram */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 items-center">
        {/* Node 1: Web Client (Next.js 14) */}
        <div
          className={`group rounded-xl border p-4 transition-all duration-300 ${
            pulseIndex === 0 || pulseIndex === 2
              ? 'border-blue-500/40 bg-blue-50/30 shadow-sm'
              : 'border-black/[0.06] bg-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Monitor className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-medium text-blue-600 uppercase tracking-wide">
              CLIENT • 01
            </span>
          </div>
          <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Next.js 14 Portal</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">React 19 • App Router</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 border-t border-black/[0.04] pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>State: Synchronized</span>
          </div>
        </div>

        {/* Node 2: Central Auth Engine & Token Hub */}
        <div
          className={`group rounded-xl border p-4 relative overflow-hidden transition-all duration-500 ${
            mode === 'signup'
              ? 'border-emerald-500/40 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500/20'
              : 'border-zinc-900/20 bg-zinc-900 text-white shadow-lg'
          }`}
        >
          {/* Subtle pulse line */}
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                mode === 'signup' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white'
              }`}
            >
              {mode === 'signup' ? <KeyRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-blue-400" />}
            </div>
            <span
              className={`text-[10px] font-mono font-semibold uppercase tracking-wide ${
                mode === 'signup' ? 'text-emerald-700' : 'text-zinc-400'
              }`}
            >
              CORE ENGINE
            </span>
          </div>
          <h4
            className={`text-xs font-bold tracking-tight ${
              mode === 'signup' ? 'text-zinc-900' : 'text-white'
            }`}
          >
            {mode === 'signup' ? 'Key Provisioning Hub' : 'Auth & Token Broker'}
          </h4>
          <p
            className={`text-[11px] mt-0.5 font-mono ${
              mode === 'signup' ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            JWT • bcrypt • Session Store
          </p>
          <div
            className={`mt-3 flex items-center gap-1.5 text-[10px] font-mono border-t pt-2 ${
              mode === 'signup'
                ? 'border-emerald-200/60 text-emerald-800'
                : 'border-white/10 text-zinc-300'
            }`}
          >
            <Cpu className="w-3 h-3 text-blue-400" />
            <span>Zero-Trust Handshake</span>
          </div>
        </div>

        {/* Node 3: Mobile Client (React Native Expo) */}
        <div
          className={`group rounded-xl border p-4 transition-all duration-300 ${
            pulseIndex === 1 || pulseIndex === 3
              ? 'border-emerald-500/40 bg-emerald-50/30 shadow-sm'
              : 'border-black/[0.06] bg-white/80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 uppercase tracking-wide">
              CLIENT • 02
            </span>
          </div>
          <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Expo Native App</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">React Native 0.81 • iOS/Android</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 border-t border-black/[0.04] pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Encrypted Keystore</span>
          </div>
        </div>
      </div>

      {/* Real-time sync connection flow status */}
      <div className="relative z-10 mt-4 pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-mono">Live Session Bus Active</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-zinc-400">SESSION: <strong className="text-zinc-700 font-semibold">EPHEMERAL_V2</strong></span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-400">HASH: <strong className="text-zinc-700 font-semibold">SHA256_VERIFIED</strong></span>
        </div>
      </div>
    </div>
  );
};
