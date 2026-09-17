import React from 'react';

/**
 * TechnicalGrid
 * Ambient full-page architectural background grid.
 * Combines hairline 48px grid lines with subtle intersection dots.
 * Kept at extremely low opacity (0.04 to 0.08) so it provides tactile structural depth
 * without ever distracting from foreground typography or interactive Bento cards.
 */
export const TechnicalGrid: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Hairline Technical Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #202052 1px, transparent 1px),
            linear-gradient(to bottom, #202052 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Top-fade gradient so header and top of hero remain ultra-clean */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAFAF7] to-transparent" />
    </div>
  );
};
