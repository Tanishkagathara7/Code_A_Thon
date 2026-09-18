import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Editorial floating handwritten/technical annotations and badges
 */
export const EditorialAnnotation: React.FC<{
  text: string;
  subtext?: string;
  rotation?: string;
  className?: string;
  withArrow?: boolean;
}> = ({ text, subtext, rotation = '-rotate-6', className = '', withArrow = false }) => {
  return (
    <div
      className={`pointer-events-none select-none inline-flex flex-col items-start ${rotation} ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 text-zinc-500 font-serif italic text-sm tracking-wide">
        <span>{text}</span>
        {withArrow && <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />}
      </div>
      {subtext && (
        <span className="text-xs font-mono font-medium tracking-wide text-zinc-500">
          {subtext}
        </span>
      )}
    </div>
  );
};

export const TechnicalTag: React.FC<{
  label: string;
  className?: string;
  vertical?: boolean;
}> = ({ label, className = '', vertical = false }) => {
  return (
    <div
      className={`pointer-events-none select-none text-xs font-mono font-semibold tracking-wider text-zinc-600 dark:text-zinc-300 uppercase ${
        vertical ? 'writing-vertical tracking-[0.25em]' : ''
      } ${className}`}
      style={vertical ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : undefined}
      aria-hidden="true"
    >
      {label}
    </div>
  );
};

export const GeometricCluster: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="w-2.5 h-2.5 rounded-full bg-pink-400/60" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
      <span className="w-2 h-2 rounded-sm bg-amber-400/50 rotate-45" />
    </div>
  );
};
