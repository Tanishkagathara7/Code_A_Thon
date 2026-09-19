'use client';

import React, { useState } from 'react';
import { ActivityMetric, HackathonItem } from '@/lib/types';
import { Calendar, Gauge, Clock } from 'lucide-react';

interface IncidentTrendChartProps {
  activity?: ActivityMetric[];
  total?: number;
  items?: HackathonItem[];
}

export const IncidentTrendChart: React.FC<IncidentTrendChartProps> = ({
  total = 0,
  items = [],
}) => {
  const [range, setRange] = useState<'7D' | '30D' | '14D'>('7D');

  // Compute total invoices from items or total prop
  const effectiveItems = items;
  const windowTotal = effectiveItems.length > 0 ? effectiveItems.length : total;

  // Generate date slots based on selected range
  const { barData, maxVal, yTicks } = React.useMemo(() => {
    const now = new Date();
    const slots: { label: string; key: string; isToday: boolean }[] = [];

    const daysCount = range === '30D' ? 14 : range === '14D' ? 14 : 7;

    const formatLocalKey = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = formatLocalKey(d);
      const label = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      slots.push({ label, key, isToday: i === 0 });
    }

    // Group items by date
    const itemsByDate: Record<string, { total: number; paid: number; due: number }> = {};
    slots.forEach((s) => {
      itemsByDate[s.key] = { total: 0, paid: 0, due: 0 };
    });

    effectiveItems.forEach((item) => {
      let itemDateKey = '';
      if (item.createdAt) {
        try {
          const itemDate = new Date(item.createdAt);
          if (!isNaN(itemDate.getTime())) {
            itemDateKey = formatLocalKey(itemDate);
          }
        } catch {
          // ignore
        }
      }
      if (!itemDateKey || !itemsByDate[itemDateKey]) {
        // If created today or out of range, attribute to today
        itemDateKey = slots[slots.length - 1].key;
      }

      if (itemsByDate[itemDateKey]) {
        itemsByDate[itemDateKey].total += 1;
        const isPaid =
          item.status === 'completed' ||
          (item.attributes as Record<string, unknown>)?.paymentStatus === 'Paid in Full';
        if (isPaid) {
          itemsByDate[itemDateKey].paid += 1;
        } else {
          itemsByDate[itemDateKey].due += 1;
        }
      }
    });

    const bars = slots.map((s) => {
      const d = itemsByDate[s.key];
      const count = d.total;
      return {
        label: s.label,
        key: s.key,
        due: d.due,
        paid: d.paid,
        total: count,
      };
    });

    const highestCount = Math.max(...bars.map((b) => b.total), 0);
    // Determine top tick for Y-axis (e.g. 5 if highest is <= 5, or round up to nearest multiple of 5)
    const topTick = highestCount <= 4 ? 4 : highestCount <= 8 ? 8 : Math.ceil(highestCount / 5) * 5;
    const ticks = [
      topTick,
      Math.round(topTick * 0.75),
      Math.round(topTick * 0.5),
      Math.round(topTick * 0.25),
      0,
    ];

    return {
      barData: bars,
      maxVal: topTick,
      yTicks: ticks,
    };
  }, [effectiveItems, range]);

  // Statistics
  const peakDayCount = Math.max(...barData.map((b) => b.total), 0);
  const avgRatePerDay = (windowTotal / barData.length).toFixed(1);

  const svgWidth = 660;
  const svgHeight = 160;
  const chartBottomY = 135;
  const chartTopY = 25;
  const chartHeight = chartBottomY - chartTopY;

  // Calculate X position for each date bar & point
  const totalSlots = barData.length;
  const slotWidth = (svgWidth - 90) / (totalSlots - 1);

  // Line trend coordinate points
  const linePoints = barData.map((b, i) => {
    const x = 50 + i * slotWidth;
    const count = b.total;
    const y = chartBottomY - (count / maxVal) * chartHeight;
    return { x, y, count };
  });

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
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-4 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H6L9 4L15 20L18 12H21" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101226]">Billing & Invoicing Activity</h3>
            <p className="text-xs text-[#68728A]">Date-wise invoice issuance and payment trends</p>
          </div>
        </div>

        {/* 7D, 14D, 30D toggles */}
        <div className="flex items-center p-1 bg-[#F8F9FC] border border-[#E6E9F0] rounded-xl text-xs font-semibold self-start sm:self-auto">
          {(['7D', '14D', '30D'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-3 py-1 rounded-lg transition-all ${
                range === item
                  ? 'bg-emerald-600 text-white shadow-xs'
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
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider block">
              WINDOW TOTAL
            </span>
            <span className="text-xs font-bold text-[#101226]">
              <strong className="text-sm font-black">{windowTotal}</strong> invoices
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
              <strong className="text-sm font-black">{avgRatePerDay}</strong> / day
            </span>
          </div>
        </div>

        {/* Peak Day */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0]">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16B981] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider block">
              PEAK DAY
            </span>
            <span className="text-xs font-bold text-[#101226]">
              <strong className="text-sm font-black">{peakDayCount}</strong> bills <span className="text-[10px] text-[#68728A] font-normal">{windowTotal > 0 ? 'Recorded' : 'No data'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-[#68728A] font-medium text-xs">Total Invoices</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span className="text-[#68728A] font-medium text-xs">Credit / Due</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[#68728A] font-medium text-xs">Paid in Full</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="relative w-full h-52 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          {/* Y-Axis Gridlines & labels */}
          {yTicks.map((val, idx) => {
            const y = chartTopY + idx * (chartHeight / (yTicks.length - 1));
            return (
              <g key={`${val}-${idx}`}>
                <text x="12" y={y + 3} className="text-[10px] fill-[#68728A] font-sans font-medium">
                  {val}
                </text>
                <line x1="32" y1={y} x2={svgWidth} y2={y} stroke="#E6E9F0" strokeWidth="1" />
              </g>
            );
          })}

          {/* Stacked Bars for each Date */}
          {barData.map((bar, i) => {
            const pt = linePoints[i];
            const x = pt.x - 7;
            const barWidth = 14;
            const paidHeight = (bar.paid / maxVal) * chartHeight;
            const dueHeight = (bar.due / maxVal) * chartHeight;

            return (
              <g key={bar.key}>
                {/* Due / Unpaid segment */}
                {dueHeight > 0 && (
                  <rect
                    x={x}
                    y={chartBottomY - paidHeight - dueHeight}
                    width={barWidth}
                    height={dueHeight}
                    fill="#38BDF8"
                    rx="2"
                  />
                )}
                {/* Paid in full segment */}
                {paidHeight > 0 && (
                  <rect
                    x={x}
                    y={chartBottomY - paidHeight}
                    width={barWidth}
                    height={paidHeight}
                    fill="#10B981"
                    rx="2"
                  />
                )}
                {/* Base bar if count is 0 for placeholder bar */}
                {bar.total === 0 && (
                  <rect
                    x={x}
                    y={chartBottomY - 2}
                    width={barWidth}
                    height={2}
                    fill="#E6E9F0"
                    rx="1"
                  />
                )}
              </g>
            );
          })}

          {/* Smooth Trend Line Over Bars */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points on Line */}
          {linePoints.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.count > 0 ? 5 : 3.5}
                fill={pt.count > 0 ? '#6366F1' : '#FFFFFF'}
                stroke="#6366F1"
                strokeWidth="2"
              />
              {pt.count > 0 && (
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className="text-[10px] font-black fill-[#4338CA]"
                >
                  {pt.count}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* X-Axis Timeline Labels (Date Wise) */}
        <div className="flex justify-between pl-9 pr-2 text-[10px] font-medium text-[#68728A] font-sans mt-2">
          {barData.map((b) => (
            <span key={b.key} className="text-center truncate">
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

