'use client';

import React from 'react';

interface HighlightProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'lavender';
  className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const styles = {
    blue: 'text-blue-600 bg-blue-50/80 border-blue-200/60',
    green: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/60',
    amber: 'text-amber-700 bg-amber-50/80 border-amber-200/60',
    lavender: 'text-violet-700 bg-violet-50/80 border-violet-200/60',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-lg border font-semibold tracking-tight ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
