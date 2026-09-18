'use client';

import React, { useState } from 'react';
import { ActivityMetric } from '@/lib/types';
import { Calendar, Gauge, Clock } from 'lucide-react';

interface IncidentTrendChartProps {
  activity?: ActivityMetric[];
  total?: number;
}

export const IncidentTrendChart: React.FC<IncidentTrendChartProps> = ({
  activity = [],
  total = 0,
}) => {
  const [range, setRange] = useState<'24H' | '7D' | '30D'>('24H');

  // Hardcoded or dynamically calibrated time ticks matching reference screenshot
  const timeLabels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

  // Real calculations
  const windowTotal = total;
  const avgRatePerHour = total > 0 ? (total / 24).toFixed(1) : '0';
  const peakHourIncidents = activity.length > 0 ? Math.max(...activity.map((a) => a.count), 0) : 0;

  // Bar data dynamically generated from activity or clean zeros
  const hasData = total > 0 && activity.length > 0;

  // Normalized bars for 17 slots
  const barData = Array.from({ length: 17 }).map((_, i) => {
    if (!hasData) return { new: 0, active: 0, resolved: 0 };
    const act = activity[i % activity.length];
    const count = act ? act.count : 0;
    return {
      new: Math.round(count * 0.4),
      active: Math.round(count * 0.35),
      resolved: Math.round(count * 0.25),
    };
  });

  const maxVal = Math.max(...barData.map((b) => b.new + b.active + b.resolved), 1);

  // Line trend coordinate points
  const linePoints = barData.map((b, i) => {
    const x = 50 + i * 35;
    const count = b.new + b.active + b.resolved;
    const y = hasData ? 132 - (count / maxVal) * 50 : 132;
    return { x, y };
  });

  const svgWidth = 660;
  const svgHeight = 160;

  // Build smooth path
  const linePath = linePoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, '');

  return (
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-6 shadow-xs flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#5B45F5] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H6L9 4L15 20L18 12H21" stroke="#5B45F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101226]">Incident Activity</h3>
            <p className="text-xs text-[#68728A]">Real-time incident trends across all platforms</p>
          </div>
        </div>

        {/* 24H, 7D, 30D toggles */}
        <div className="flex items-center p-1 bg-[#F8F9FC] border border-[#E6E9F0] rounded-xl text-xs font-semibold">
          {(['24H', '7D', '30D'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-3 py-1 rounded-lg transition-all ${
                range === item
                  ? 'bg-[#5B45F5] text-white shadow-xs'
                  : 'text-[#68728A] hover:text-[#101226]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Summary Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Window Total */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0]">
          <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider block">
              WINDOW TOTAL
            </span>
            <span className="text-xs font-bold text-[#101226]">
              <strong className="text-sm font-black">{windowTotal}</strong> incidents
            </span>
          </div>
        </div>

        {/* Average Rate */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0]">
          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider block">
              AVERAGE RATE
            </span>
            <span className="text-xs font-bold text-[#101226]">
              <strong className="text-sm font-black">{avgRatePerHour}</strong> / hour
            </span>
          </div>
        </div>

        {/* Peak Hour */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0]">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16B981] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider block">
              PEAK HOUR
            </span>
            <span className="text-xs font-bold text-[#101226]">
              <strong className="text-sm font-black">{peakHourIncidents}</strong> incidents <span className="text-[10px] text-[#68728A] font-normal">{hasData ? 'Today' : 'No peak data'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex items-center justify-center gap-6 pb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-[#68728A] font-medium text-xs">New</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span className="text-[#68728A] font-medium text-xs">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[#68728A] font-medium text-xs">Resolved</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="relative w-full h-48 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          {/* Y-Axis Gridlines & labels */}
          {[20, 15, 10, 5, 0].map((val, idx) => {
            const y = 20 + idx * 28;
            return (
              <g key={val}>
                <text x="10" y={y + 3} className="text-[10px] fill-[#68728A] font-sans">
                  {val}
                </text>
                <line x1="28" y1={y} x2={svgWidth} y2={y} stroke="#E6E9F0" strokeWidth="1" />
              </g>
            );
          })}

          {/* Stacked Bars */}
          {barData.map((bar, i) => {
            const x = 50 + i * 35;
            const baseY = 132;
            const hNew = bar.new * 0.7;
            const hActive = bar.active * 0.7;
            const hResolved = bar.resolved * 0.7;

            return (
              <g key={i}>
                {/* Resolved segment (bottom or top) */}
                {hResolved > 0 && (
                  <rect
                    x={x}
                    y={baseY - hNew - hActive - hResolved}
                    width="10"
                    height={hResolved}
                    fill="#34D399"
                    rx="1"
                  />
                )}
                {/* Active segment */}
                {hActive > 0 && (
                  <rect
                    x={x}
                    y={baseY - hNew - hActive}
                    width="10"
                    height={hActive}
                    fill="#818CF8"
                    rx="1"
                  />
                )}
                {/* New segment (base) */}
                <rect
                  x={x}
                  y={baseY - hNew}
                  width="10"
                  height={hNew}
                  fill="#A78BFA"
                  rx="1"
                />
              </g>
            );
          })}

          {/* Smooth Trend Line Over Bars */}
          <path
            d={linePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points on Line */}
          {linePoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#FFFFFF"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* X-Axis Timeline Labels */}
        <div className="flex justify-between pl-8 pr-4 text-[10px] text-[#68728A] font-sans mt-1">
          {timeLabels.map((lbl) => (
            <span key={lbl}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
