'use client';

import React, { useState } from 'react';
import { Terminal, ArrowRight, Sparkles, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { Highlight } from './Highlight';

export const InteractiveDemonstrator: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      phase: '01',
      title: 'Desktop Operation Dispatch & Schema Validation',
      client: 'NEXT.JS 14 CLIENT',
      accent: 'blue',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        'Operations created on the Next.js desktop workspace validate Mongoose schemas and execute atomic mutations against MongoDB Atlas.',
      requestMethod: 'POST',
      requestPath: '/api/items',
      payload: `{
  "title": "Production Deployment Gate",
  "category": "Deployment",
  "priority": "high",
  "status": "in_progress"
}`,
      responseStatus: 'HTTP/1.1 201 Created',
      responseDetail: 'Mongoose Transaction: Verified • MongoDB Atlas: Written',
      systemMetrics: [
        { label: 'DB Latency', value: '38ms' },
        { label: 'Schema Audit', value: 'Strict Type' },
      ],
    },
    {
      id: 1,
      phase: '02',
      title: 'OpenRouter AI Summarization & Task Synthesis',
      client: 'EXPRESS CORE API',
      accent: 'lavender',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
      description:
        'The shared backend dispatches verified records to the OpenRouter AI Gateway to generate operational risk evaluations and action summaries.',
      requestMethod: 'POST',
      requestPath: '/api/ai/generate',
      payload: `{
  "model": "openrouter/auto",
  "prompt": "Evaluate current items pipeline for cross-platform parity."
}`,
      responseStatus: 'HTTP/1.1 200 OK',
      responseDetail: 'Gateway: OpenRouter • Tokens Ingested: 284 • Status: Ready',
      systemMetrics: [
        { label: 'AI Gateway', value: 'OpenRouter' },
        { label: 'Audit Output', value: 'Generated' },
      ],
    },
    {
      id: 2,
      phase: '03',
      title: 'Native Mobile Parity & SecureStore Persistence',
      client: 'REACT NATIVE EXPO',
      accent: 'green',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Mobile clients receive cache invalidation signals and persist cryptographic session credentials securely via expo-secure-store.',
      requestMethod: 'GET',
      requestPath: '/api/items?syncToken=verified',
      payload: `// Synchronized native payload
{
  "client": "Expo SDK 57",
  "secureStoreToken": "Bearer eyJhbGciOiJIUzI1...",
  "status": "synchronized"
}`,
      responseStatus: 'HTTP/1.1 200 OK',
      responseDetail: 'Client Invalidation: Verified • Gesture UI Re-Render: < 16ms',
      systemMetrics: [
        { label: 'Sync Delay', value: '< 35ms' },
        { label: 'Native Storage', value: 'Encrypted' },
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="w-full space-y-6 select-none">
      {/* Step Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isActive
                  ? 'bg-white border-blue-500/40 shadow-lg shadow-blue-500/[0.04] ring-1 ring-blue-500/20'
                  : 'bg-white/70 hover:bg-white border-black/[0.06] hover:border-black/[0.12] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isActive ? step.badgeBg : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}
                >
                  PHASE {step.phase}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">0{idx + 1}/03</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900 leading-snug">
                {step.title}
              </div>
              <div className="text-[11px] font-medium text-zinc-500 mt-1">
                {step.client}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Execution Stage */}
      <div className="bento-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${current.badgeBg}`}>
                {current.client}
              </span>
              <span className="text-xs text-zinc-400 font-mono">• ACTIVE PIPELINE</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900">
              {current.title}
            </h3>
            <p className="text-sm text-zinc-600 max-w-2xl">
              {current.description}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {current.systemMetrics.map((m, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">{m.label}</div>
                <div className="text-zinc-900 font-bold mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Request & Response Split Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Request Stream */}
          <div className="rounded-xl bg-zinc-950 text-white p-4 font-mono text-xs space-y-3 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                OUTBOUND DISPATCH
              </span>
              <span className="text-blue-400 font-bold">
                {current.requestMethod} {current.requestPath}
              </span>
            </div>
            <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-900/60 rounded-lg text-[11px] leading-relaxed">
              {current.payload}
            </pre>
          </div>

          {/* Response Stream */}
          <div className="rounded-xl bg-zinc-950 text-white p-4 font-mono text-xs space-y-3 shadow-sm border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CONFIRMED RECEIPT
              </span>
              <span className="text-emerald-400 font-bold">
                {current.responseStatus}
              </span>
            </div>
            <div className="space-y-2 p-2 bg-zinc-900/60 rounded-lg">
              <div className="text-zinc-400 text-[11px]">{current.responseDetail}</div>
              <div className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographic Handshake Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
