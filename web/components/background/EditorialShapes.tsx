import React from 'react';

/**
 * Large pastel organic shapes and soft abstract geometric geometry
 */
export const EditorialShapes: React.FC = () => {
  return null; // Helper container if needed
};

export const OrganicBlob: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
  path: string;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}> = ({
  className = '',
  width = 400,
  height = 400,
  viewBox = '0 0 400 400',
  path,
  fill = 'url(#grad-pink-lavender)',
  opacity = 0.75,
  stroke,
  strokeWidth = 1,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d={path}
        fill={fill}
        opacity={opacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const FloatingSphere: React.FC<{
  size?: number;
  gradientId?: string;
  className?: string;
  glow?: boolean;
}> = ({ size = 64, gradientId = 'sphere-cyan-pink', className = '', glow = true }) => {
  return (
    <div
      className={`relative inline-block pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40"
          style={{ background: 'radial-gradient(circle, #F472B6 0%, #38BDF8 100%)' }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 1}
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
};

export const AccentDot: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  pulse?: boolean;
}> = ({ size = 8, color = '#2563EB', className = '', pulse = false }) => {
  return (
    <div
      className={`rounded-full pointer-events-none select-none inline-block ${
        pulse ? 'animate-pulse' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      aria-hidden="true"
    />
  );
};
