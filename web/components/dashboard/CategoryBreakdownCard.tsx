'use client';

import React, { useState } from 'react';
import { ChevronDown, Smile, AlertCircle } from 'lucide-react';

interface CategoryBreakdownCardProps {
  categories?: { category: string; count: number }[];
  totalIncidents?: number;
}

const CATEGORY_COLORS = ['#5B45F5', '#38BDF8', '#10B981', '#F59E0B', '#94A3B8', '#EC4899', '#8B5CF6'];

export const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({
  categories = [],
  totalIncidents = 0,
}) => {
  const [selectedRange, setSelectedRange] = useState('Last 30 days');

  // Compute dynamic slices
  const slices = categories.length > 0 && totalIncidents > 0
    ? categories.map((c, i) => ({
        label: c.category || 'General',
        count: c.count,
        percentage: Math.round((c.count / totalIncidents) * 100),
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
    : [];

  const radius = 54;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#5B45F5] flex items-center justify-center">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101226]">GST Slabs & Supply Breakdown</h3>
            <p className="text-xs text-[#68728A]">Distribution of invoices by tax slab & state</p>
          </div>
        </div>

        {/* Dropdown filter */}
        <div className="relative">
          <button className="flex items-center gap-1 text-xs text-[#68728A] border border-[#E6E9F0] px-2.5 py-1 rounded-lg hover:text-[#101226] transition-colors">
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#68728A]" />
          </button>
        </div>
      </div>

      {/* Donut and Legend row */}
      {totalIncidents === 0 || slices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#F8F9FC] border border-[#E6E9F0] flex items-center justify-center text-[#68728A]">
            <AlertCircle className="w-5 h-5 text-[#94A3B8]" />
          </div>
          <span className="text-2xl font-black text-[#101226]">0</span>
          <p className="text-xs text-[#68728A]">No billing category data yet</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* SVG Donut Chart */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {slices.map((slice, i) => {
                const dashLength = (slice.percentage / 100) * circumference;
                const spaceLength = circumference - dashLength;
                const strokeDashoffset = -cumulativeAngle;
                cumulativeAngle += dashLength;

                return (
                  <circle
                    key={i}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dashLength} ${spaceLength}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="butt"
                  />
                );
              })}
            </svg>

            {/* Central Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black text-[#101226] leading-none">
                {totalIncidents}
              </span>
              <span className="text-[11px] font-medium text-[#68728A] mt-0.5">
                Invoices
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col space-y-2.5 min-w-[130px] flex-1">
            {slices.map((slice, i) => (
              <div key={i} className="flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-[#101226] font-medium">{slice.label}</span>
                </div>
                <span className="font-bold text-[#101226]">{slice.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
