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

function AnimatedValue({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = React.useState<string | number>(() => {
    if (typeof value === 'number') return 0;
    if (typeof value === 'string') {
      const match = value.match(/^(.*?)(\d[\d,]*\.?\d*)(.*?)$/);
      if (match) {
        return `${match[1]}0${match[3]}`;
      }
    }
    return value;
  });

  React.useEffect(() => {
    let animationFrameId: number;

    if (value === undefined || value === null || value === '—') {
      animationFrameId = requestAnimationFrame(() => {
        setDisplayValue(value);
      });
      return () => cancelAnimationFrame(animationFrameId);
    }

    // Check if numeric or contains number
    let prefix = '';
    let suffix = '';
    let targetNum = 0;
    let hasDecimals = false;
    let decimals = 0;

    if (typeof value === 'number') {
      targetNum = value;
    } else {
      const match = String(value).match(/^(.*?)(\d[\d,]*\.?\d*)(.*?)$/);
      if (!match) {
        animationFrameId = requestAnimationFrame(() => {
          setDisplayValue(value);
        });
        return () => cancelAnimationFrame(animationFrameId);
      }
      prefix = match[1];
      const rawNumStr = match[2].replace(/,/g, '');
      targetNum = parseFloat(rawNumStr) || 0;
      suffix = match[3];
      if (rawNumStr.includes('.')) {
        hasDecimals = true;
        decimals = rawNumStr.split('.')[1].length;
      }
    }

    if (isNaN(targetNum) || targetNum === 0) {
      animationFrameId = requestAnimationFrame(() => {
        setDisplayValue(value);
      });
      return () => cancelAnimationFrame(animationFrameId);
    }

    const duration = 1000; // 1s count-up
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo / cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = targetNum * easeProgress;

      let formattedCurrent: string;
      if (hasDecimals) {
        formattedCurrent = currentNum.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      } else {
        formattedCurrent = Math.round(currentNum).toLocaleString('en-IN');
      }

      setDisplayValue(`${prefix}${formattedCurrent}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <>{displayValue}</>;
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
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-4.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden min-w-0">
      {/* Top Header: Icon and Label */}
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
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
        <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider truncate">
          {label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 mt-3 min-w-0">
        <span className="text-xl sm:text-2xl xl:text-[26px] 2xl:text-3xl font-black tracking-tight text-[#101226] whitespace-nowrap leading-tight">
          {value !== undefined && value !== null ? (
            <AnimatedValue value={value} />
          ) : (
            0
          )}
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap leading-none ${
              variant === 'active'
                ? 'bg-[#FEE2E2] text-[#EF4444]'
                : 'bg-[#DCFCE7] text-[#16A34A]'
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
