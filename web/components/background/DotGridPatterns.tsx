import React from 'react';

/**
 * Reusable dot grids, linear technical gradients, and diagonal hatch patterns
 * Includes radial masks for soft edge falloffs so grids blend naturally into the canvas.
 */
export const DotGridPatterns: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Radial mask for gradual grid fade */}
        <mask id="radial-fade-mask">
          <radialGradient id="mask-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <rect width="100%" height="100%" fill="url(#mask-grad)" />
        </mask>

        {/* Subtle dot matrix grid 16px */}
        <pattern
          id="editorial-dot-grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.1" fill="#202052" fillOpacity="0.14" />
        </pattern>

        {/* Dense dot matrix grid 10px */}
        <pattern
          id="editorial-dot-grid-dense"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="0.9" fill="#202052" fillOpacity="0.16" />
        </pattern>

        {/* Cyan/Mint dot matrix grid */}
        <pattern
          id="editorial-dot-grid-mint"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="#059669" fillOpacity="0.22" />
        </pattern>

        {/* Diagonal technical hatch lines */}
        <pattern
          id="editorial-diagonal-hatch"
          width="14"
          height="14"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="14"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeOpacity="0.25"
          />
        </pattern>

        {/* Technical crosshair tile pattern */}
        <pattern
          id="editorial-cross-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <line x1="24" y1="20" x2="24" y2="28" stroke="#202052" strokeWidth="0.8" strokeOpacity="0.12" />
          <line x1="20" y1="24" x2="28" y2="24" stroke="#202052" strokeWidth="0.8" strokeOpacity="0.12" />
          <circle cx="24" cy="24" r="1" fill="#202052" fillOpacity="0.2" />
        </pattern>

        {/* Soft pastel linear gradients for organic shapes */}
        <linearGradient id="grad-pink-lavender" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE1E8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#EAE7FF" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id="grad-blue-mint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DCEBFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#DDF4E9" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="grad-mint-ochre" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DDF4E9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFF0D3" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="grad-ochre-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF0D3" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FCE1E8" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id="grad-blue-lavender" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.55" />
        </linearGradient>

        {/* Radial sphere gradients matching reference design */}
        <radialGradient id="sphere-cyan-pink" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="55%" stopColor="#F472B6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.35" />
        </radialGradient>

        <radialGradient id="sphere-mint-blue" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </svg>
  );
};
