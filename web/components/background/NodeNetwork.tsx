import React from 'react';

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
  radius?: number;
  pulse?: boolean;
}

export interface NetworkConnection {
  from: string;
  to: string;
  dashed?: boolean;
  color?: string;
  strokeWidth?: number;
}

export interface NodeNetworkProps {
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  accentColor?: string;
  opacity?: number;
}

/**
 * NodeNetwork
 * An SVG engineering topology diagram representing connected clients, central engines,
 * and edge sync paths without random floating circles.
 */
export const NodeNetwork: React.FC<NodeNetworkProps> = ({
  className = '',
  width = 320,
  height = 240,
  viewBox = '0 0 320 240',
  nodes,
  connections,
  accentColor = '#2563EB',
  opacity = 1,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 1. Connecting lines */}
      {connections.map((conn, idx) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        return (
          <g key={`conn-${idx}`}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={conn.color || 'rgba(32, 32, 82, 0.15)'}
              strokeWidth={conn.strokeWidth || 1}
              strokeDasharray={conn.dashed ? '3 4' : undefined}
            />
          </g>
        );
      })}

      {/* 2. Nodes */}
      {nodes.map((node) => {
        const r = node.radius || 3.5;
        const color = node.color || accentColor;

        return (
          <g key={`node-${node.id}`}>
            {/* Outer subtle halo ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={r + 4}
              stroke={color}
              strokeWidth={0.75}
              opacity={0.3}
              className={node.pulse ? 'animate-ping origin-center' : undefined}
              style={node.pulse ? { transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '3s' } : undefined}
            />

            {/* Solid node center */}
            <circle cx={node.x} cy={node.y} r={r} fill={color} />

            {/* Optional label */}
            {node.label && (
              <text
                x={node.x + r + 5}
                y={node.y + 3}
                fill="rgba(32, 32, 82, 0.55)"
                fontSize="9"
                fontFamily="monospace"
                letterSpacing="0.05em"
              >
                {node.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
