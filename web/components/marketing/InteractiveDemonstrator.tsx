'use client';

import React, { useState } from 'react';
import { Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';
import { domainConfig } from '@/lib/domain.config';

export const InteractiveDemonstrator: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const entity = domainConfig.domain.primaryEntityName;
  const category = domainConfig.domain.categories[0] || 'Operational';

  const steps = [
    {
      id: 0,
      phase: '01',
      title: `${entity} Intake & Schema Validation`,
      client: 'NEXT.JS CLIENT',
      accent: 'blue',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        `Domain ${entity.toLowerCase()} records created on the desktop workspace validate Mongoose schemas and execute atomic mutations against MongoDB Atlas.`,
      requestMethod: 'POST',
      requestPath: '/api/items',
      payload: `{
  "title": "Priority ${entity} Dispatch",
  "category": "${category}",
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
  "prompt": "Evaluate current ${entity.toLowerCase()} pipeline for operational risk and dispatch priority."
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
    <div className="workflow-container w-full space-y-6 select-none">
      {/* Step Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-white border-blue-500/40 shadow-lg shadow-blue-500/[0.04] ring-1 ring-blue-500/20'
                  : 'bg-white/70 hover:bg-white border-black/[0.06] hover:border-black/[0.12] shadow-sm hover:-translate-y-0.5'
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
              <div key={i} className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 shadow-xs">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">{m.label}</div>
                <div className="text-zinc-900 font-bold mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Request & Response Split Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Request Stream */}
          <div className="rounded-xl bg-zinc-50/80 text-zinc-900 p-4 font-mono text-xs space-y-3 shadow-xs border border-zinc-200/80">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 text-[11px]">
              <span className="text-zinc-600 flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                OUTBOUND DISPATCH
              </span>
              <span className="text-blue-600 font-bold">
                {current.requestMethod} {current.requestPath}
              </span>
            </div>
            <pre className="text-zinc-800 overflow-x-auto p-2.5 bg-white rounded-lg text-[11px] leading-relaxed border border-zinc-200/60 shadow-2xs">
              {current.payload}
            </pre>
          </div>

          {/* Response Stream */}
          <div className="rounded-xl bg-zinc-50/80 text-zinc-900 p-4 font-mono text-xs space-y-3 shadow-xs border border-zinc-200/80">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 text-[11px]">
              <span className="text-zinc-600 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                CONFIRMED RECEIPT
              </span>
              <span className="text-emerald-600 font-bold">
                {current.responseStatus}
              </span>
            </div>
            <div className="space-y-2 p-2.5 bg-white rounded-lg border border-zinc-200/60 shadow-2xs">
              <div className="text-zinc-600 text-[11px]">{current.responseDetail}</div>
              <div className="text-emerald-700 text-[11px] flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cryptographic Handshake Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
