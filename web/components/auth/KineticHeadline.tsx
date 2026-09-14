'use client';

import React, { useEffect, useState, useId } from 'react';

interface KineticHeadlineProps {
  lines: string[][];
  subheading?: string;
  className?: string;
  mode?: 'signin' | 'signup' | 'reset';
}

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  lines,
  subheading = 'One shared Express backend, cryptographically secure JWT authentication, and zero latency across React Native Expo and Next.js 14 workspaces.',
  className = '',
  mode = 'signin',
}) => {
  const componentId = useId().replace(/:/g, '');

  // Flatten words with static global indices
  let globalCount = 0;
  const structuredLines = lines.map((line) =>
    line.map((word) => {
      const idx = globalCount++;
      return { word, idx };
    })
  );
  const totalWords = globalCount;

  // Track hydration so CSS keyframes take over smoothly without layout shift or missing words
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mode]);

  return (
    <div className={`select-none ${className}`}>
      {/* Dynamic Keyframe Injection for silky-smooth hardware-accelerated kinetic animation */}
      <style>{`
        @keyframes kineticReveal {
          0% {
            opacity: 0;
            transform: translateY(12px);
            filter: blur(6px);
            color: #71717a;
          }
          40% {
            opacity: 0.95;
            transform: translateY(-2px);
            filter: blur(0.5px);
            color: #2563eb;
          }
          70% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
            color: #1d4ed8;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
            color: #09090b;
          }
        }
      `}</style>

      {/* Kinetic Words Display: Static layout to prevent word-wrapping or truncation */}
      <div className="space-y-1 sm:space-y-1.5" key={`${componentId}-${mode}`}>
        {structuredLines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5">
            {line.map(({ word, idx }) => {
              const delay = idx * 0.16; // 160ms staggering between words

              return (
                <span
                  key={idx}
                  style={{
                    animation: `kineticReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
                    willChange: 'transform, opacity, filter',
                  }}
                  className="inline-block font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-zinc-950"
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Supporting context */}
      <p className="mt-4 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-lg">
        {subheading}
      </p>
    </div>
  );
};
