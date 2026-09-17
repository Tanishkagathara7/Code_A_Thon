import React from 'react';

/**
 * Technical linework: sweeping orbital arcs, tangent lines, crosshairs, endpoints
 */
interface TechnicalArcProps {
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
  path: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  endpointDot?: { cx: number; cy: number; r?: number; color?: string };
}

export const TechnicalArc: React.FC<TechnicalArcProps> = ({
  className = '',
  width = 300,
  height = 300,
  viewBox = '0 0 300 300',
  path,
  strokeColor = 'rgba(32, 32, 82, 0.22)',
  strokeWidth = 1,
  strokeDasharray,
  endpointDot,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
      {endpointDot && (
        <circle
          cx={endpointDot.cx}
          cy={endpointDot.cy}
          r={endpointDot.r || 3}
          fill={endpointDot.color || '#38BDF8'}
        />
      )}
    </svg>
  );
};

export const TechnicalCrosshair: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 8, color = 'rgba(32, 32, 82, 0.35)', className = '' }) => {
  const half = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={`pointer-events-none select-none inline-block ${className}`}
      aria-hidden="true"
    >
      <line x1="0" y1={half} x2={size} y2={half} stroke={color} strokeWidth="1" />
      <line x1={half} y1="0" x2={half} y2={size} stroke={color} strokeWidth="1" />
    </svg>
  );
};

export const TechnicalConnectingLine: React.FC<{
  length?: number;
  vertical?: boolean;
  color?: string;
  className?: string;
  withArrow?: boolean;
}> = ({ length = 80, vertical = false, color = 'rgba(32, 32, 82, 0.2)', className = '', withArrow = false }) => {
  if (vertical) {
    return (
      <svg
        width="8"
        height={length}
        viewBox={`0 0 8 ${length}`}
        fill="none"
        className={`pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <line x1="4" y1="0" x2="4" y2={length} stroke={color} strokeWidth="1" />
        <circle cx="4" cy="2" r="1.5" fill={color} />
        {withArrow ? (
          <path d={`M1 ${length - 4} L4 ${length} L7 ${length - 4}`} stroke={color} strokeWidth="1" />
        ) : (
          <circle cx="4" cy={length - 2} r="1.5" fill={color} />
        )}
      </svg>
    );
  }

  return (
    <svg
      width={length}
      height="8"
      viewBox={`0 0 ${length} 8`}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <line x1="0" y1="4" x2={length} y2="4" stroke={color} strokeWidth="1" />
      <circle cx="2" cy="4" r="1.5" fill={color} />
      {withArrow ? (
        <path d={`M${length - 4} 1 L${length} 4 L${length - 4} 7`} stroke={color} strokeWidth="1" />
      ) : (
        <circle cx={length - 2} cy="4" r="1.5" fill={color} />
      )}
    </svg>
  );
};
