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
      <div className="max-w-2xl space-y-2">
        <div className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
          {'// 08. TOPOLOGY & DATA BUS'}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          CENTRAL ENGINE & EDGE TOPOLOGY
        </h2>
        <p className="text-sm text-zinc-600">
          One authoritative REST architecture powers both client applications without code duplication or state divergence.
        </p>
      </div>

      {/* Interactive Topology Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(nodes).map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-5 rounded-2xl text-left transition-all border relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-blue-500/50 shadow-lg shadow-blue-500/[0.06] ring-2 ring-blue-500/20'
                  : 'bg-white/80 hover:bg-white border-black/[0.06] hover:border-black/[0.12] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                  {node.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="font-bold text-zinc-900 text-base leading-snug">
                {node.name}
              </div>

              <div className="text-[11px] font-mono text-zinc-500 mt-1">
                {node.role}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Spec Sheet */}
      <div className="bento-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${active.badgeColor}`}>
                {active.badge}
              </span>
              <span className="text-xs font-mono text-zinc-400">• ACTIVE INSPECTOR</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              {active.name}
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-500 uppercase">
            {active.role}
          </span>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
          {active.specs}
        </p>

        <div>
          <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Integrated Technologies & Modules
          </div>
          <div className="flex flex-wrap gap-2">
            {active.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-lg bg-zinc-100/80 border border-zinc-200 text-zinc-800 text-xs font-mono font-medium"
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
