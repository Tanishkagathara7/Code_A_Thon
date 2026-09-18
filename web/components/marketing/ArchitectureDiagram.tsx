'use client';

import React, { useState } from 'react';

interface ArchNode {
  id: string;
  name: string;
  role: string;
  badge: string;
  accentBg: string;
  badgeColor: string;
  tech: string[];
  specs: string;
}

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('backend');

  const nodes: Record<string, ArchNode> = {
    mobile: {
      id: 'mobile',
      name: 'React Native Expo Client',
      role: 'GESTURE & NATIVE CLIENT',
      badge: 'NODE 01',
      accentBg: 'from-blue-500/10 to-transparent',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      tech: ['Expo SDK 57', 'Expo Router', 'Reanimated 4.5.1', 'expo-secure-store'],
      specs: 'Compiled for iOS and Android. Manages cryptographic JWT bearer tokens in SecureStore, handling native gestures and offline caching.',
    },
    backend: {
      id: 'backend',
      name: 'Node.js / Express Core Server',
      role: 'CENTRAL REST & GATEWAY',
      badge: 'CORE ENGINE',
      accentBg: 'from-emerald-500/10 to-transparent',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tech: ['Express.js', 'Mongoose ODM', 'JWT Auth', 'Multer Storage', 'OpenRouter Gateway'],
      specs: 'Central REST router running on port 5000. Provides Helmet security headers, rate limiting, and atomic transaction handling.',
    },
    web: {
      id: 'web',
      name: 'Next.js 14 Web Workspace',
      role: 'DESKTOP OPERATIONAL CENTER',
      badge: 'NODE 02',
      accentBg: 'from-amber-500/10 to-transparent',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      tech: ['Next.js App Router', 'React 19', 'Tailwind CSS', 'Lenis Smooth Motion', 'AuthContext'],
      specs: 'High-density desktop operational workspace. Direct client-side token interception, responsive grid views, and batch asset uploads.',
    },
    database: {
      id: 'database',
      name: 'MongoDB Atlas Persistence',
      role: 'DOCUMENT STATE STORE',
      badge: 'PERSISTENCE',
      accentBg: 'from-violet-500/10 to-transparent',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      tech: ['Mongoose Schemas', 'User Entities', 'Items Pipeline', 'Notification Collections'],
      specs: 'Primary persistent datastore. Enforces strict schema validations and indexed queries across domain items and user collections.',
    },
  };

  const active = nodes[selectedNode];

  return (
    <div className="w-full space-y-8 select-none">
      <div className="topology-header max-w-2xl space-y-2">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600">
          {'// 08. TOPOLOGY & DATA BUS'}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
          Central Engine & Edge Topology
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
          One authoritative REST architecture powers both client applications without code duplication or state divergence.
        </p>
      </div>



      {/* Interactive Topology Bento Grid */}
      <div role="tablist" aria-label="Architecture Nodes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(nodes).map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedNode(node.id)}
              className={`topology-node-btn p-5 rounded-2xl text-left transition-all duration-200 border relative overflow-hidden cursor-pointer group flex flex-col justify-between min-h-[145px] ${
                isSelected
                  ? 'bg-white border-zinc-950 shadow-lg shadow-black/[0.08] ring-2 ring-zinc-900/20'
                  : 'bg-white/80 hover:bg-white border-black/[0.06] hover:border-black/[0.16] shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {isSelected && (
                <span className="absolute top-0 left-0 right-0 h-1 bg-zinc-950" />
              )}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                    {node.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isSelected ? (
                      <span className="text-[10px] font-bold font-mono text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-900 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Selected
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-600">
                        Select &rarr;
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-bold text-zinc-900 text-base leading-snug">
                  {node.name}
                </div>

                <div className="text-[11px] font-mono text-zinc-500 mt-1">
                  {node.role}
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Click to view specs</span>
                <span className={`transition-transform duration-200 ${isSelected ? 'text-zinc-950 translate-x-0.5 font-bold' : 'group-hover:translate-x-0.5'}`}>
                  &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Spec Sheet */}
      <div className="topology-detail-card bento-card p-6 sm:p-8 space-y-6 bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border ${active.badgeColor}`}>
                {active.badge}
              </span>
              <span className="text-xs font-mono text-zinc-400">• ARCHITECTURE INSPECTOR</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950">
              {active.name}
            </h3>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wide">
              {active.role}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs text-xs font-mono">
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Parity Status</div>
              <div className="text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Core
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs text-xs font-mono">
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Security Spec</div>
              <div className="text-zinc-900 font-bold mt-0.5">Strict Types</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            System Specification & Runtime Responsibility
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed max-w-4xl font-normal">
            {active.specs}
          </p>
        </div>

        <div className="pt-2 border-t border-black/[0.04]">
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
            Integrated Technologies & Production Modules
          </div>
          <div className="flex flex-wrap gap-2">
            {active.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-mono font-semibold transition-colors shadow-2xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
