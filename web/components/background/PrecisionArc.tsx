import React from 'react';

export interface PrecisionArcProps {
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
  cx: number;
  cy: number;
  radius: number;
  startAngle?: number; // In degrees, default 0
  endAngle?: number;   // In degrees, default 360
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  secondaryRadius?: number;
  secondaryDasharray?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickLength?: number;
  showCenterCrosshair?: boolean;
  startNodeColor?: string;
  endNodeColor?: string;
  tagLabel?: string;
  tagSubtext?: string;
}

/**
 * PrecisionArc
 * Mathematical SVG orbital system with multi-layer concentric geometry,
 * radial measurement ticks, tangent coordinate markers, and clean endpoint nodes.
 */
export const PrecisionArc: React.FC<PrecisionArcProps> = ({
  className = '',
  width = 360,
  height = 360,
  viewBox = '0 0 360 360',
  cx,
  cy,
  radius,
  startAngle = 0,
  endAngle = 180,
  strokeColor = 'rgba(32, 32, 82, 0.16)',
  strokeWidth = 1,
  strokeDasharray,
  secondaryRadius,
  secondaryDasharray = '3 6',
  showTicks = false,
  tickCount = 12,
  tickLength = 5,
  showCenterCrosshair = false,
  startNodeColor,
  endNodeColor,
  tagLabel,
  tagSubtext,
}) => {
  // Round numbers to 2 decimal places to guarantee identical SSR & Client hydration
  const round = (val: number) => Math.round(val * 100) / 100;

  // Convert polar coordinates to Cartesian with stable rounded floats
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: round(centerX + r * Math.cos(angleInRadians)),
      y: round(centerY + r * Math.sin(angleInRadians)),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startPt = polarToCartesian(x, y, r, end);
    const endPt = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';

    return ['M', startPt.x, startPt.y, 'A', round(r), round(r), 0, largeArcFlag, 0, endPt.x, endPt.y].join(' ');
  };

  const primaryPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const startPt = polarToCartesian(cx, cy, radius, startAngle);
  const endPt = polarToCartesian(cx, cy, radius, endAngle);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Optional Center Crosshair */}
      {showCenterCrosshair && (
        <g opacity={0.35}>
          <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke={strokeColor} strokeWidth={1} />
          <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke={strokeColor} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={1.5} fill={strokeColor} />
        </g>
      )}

      {/* Secondary Outer or Inner Concentric Arc */}
      {secondaryRadius && (
        <path
          d={describeArc(cx, cy, secondaryRadius, startAngle, endAngle)}
          stroke={strokeColor}
          strokeWidth={0.75}
          strokeDasharray={secondaryDasharray}
          opacity={0.65}
        />
      )}

      {/* Primary Arc */}
      <path
        d={primaryPath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />

      {/* Start Node */}
      {startNodeColor && (
        <circle cx={startPt.x} cy={startPt.y} r={3} fill={startNodeColor} />
      )}

      {/* End Node */}
      {endNodeColor && (
        <g>
          <circle cx={endPt.x} cy={endPt.y} r={3.5} fill={endNodeColor} />
          <circle cx={endPt.x} cy={endPt.y} r={6.5} stroke={endNodeColor} strokeWidth={0.75} opacity={0.4} />
        </g>
      )}

      {/* Technical coordinate tag at endpoint if provided */}
      {tagLabel && (
        <text
          x={round(endPt.x + 8)}
          y={round(endPt.y + 3)}
          fill="rgba(32, 32, 82, 0.45)"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="0.08em"
        >
          {tagLabel} {tagSubtext && <tspan fill="rgba(32, 32, 82, 0.3)">[{tagSubtext}]</tspan>}
        </text>
      )}
    </svg>
  );
};
