'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant: 'total' | 'active' | 'resolved' | 'velocity';
  trend?: string;
  highlight?: boolean;
}

export const OperationalMetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant,
  trend,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Header: Icon and Label */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'total'
              ? 'bg-[#F8F9FC] text-[#101226]'
              : variant === 'active'
              ? 'bg-[#EDE9FE] text-[#5B45F5]'
              : variant === 'resolved'
              ? 'bg-[#DCFCE7] text-[#16B981]'
              : 'bg-[#FEF3C7] text-[#F59E0B]'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Main Metric Value & Trend Badge */}
      <div className="flex flex-wrap items-baseline gap-2 mt-3">
        <span className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-[#101226] truncate">
          {value !== undefined && value !== null ? value : 0}
        </span>

        {trend && (
          <span
            className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              variant === 'active'
                ? 'bg-[#FEE2E2] text-[#EF4444]'
                : 'bg-[#DCFCE7] text-[#16B981]'
            }`}
          >
            {trend}
          </span>
        )}
      </div>


      {/* Bottom Subtext & Mini Sparkline Visualization */}
      <div className="flex items-end justify-between gap-3 mt-3 pt-1">
        <p className="text-xs text-[#68728A] leading-tight flex-1">
          {subtext}
        </p>

        {/* Mini visualization matching reference screenshot */}
        <div className="shrink-0 w-16 h-7 flex items-end justify-end">
          {variant === 'total' && (
            /* Mini bar columns */
            <div className="flex items-end gap-1 h-6">
              {[30, 50, 40, 70, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#E6E9F0] rounded-t-xs"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          )}

          {variant === 'active' && (
            /* Purple line sparkline */
            <svg className="w-16 h-7" viewBox="0 0 64 28" fill="none">
              <path
                d="M2 20 L16 16 L30 22 L44 10 L62 14"
                stroke="#8B5CF6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {variant === 'resolved' && (
            /* Green line sparkline */
            <svg className="w-16 h-7" viewBox="0 0 64 28" fill="none">
              <path
                d="M2 18 L16 12 L28 16 L42 8 L62 12"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {variant === 'velocity' && (
            /* Amber line sparkline */
            <svg className="w-16 h-7" viewBox="0 0 64 28" fill="none">
              <path
                d="M2 22 L14 18 L26 20 L42 12 L62 8"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
