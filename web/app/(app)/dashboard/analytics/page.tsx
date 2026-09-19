'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { analyticsApi, itemsApi } from '@/lib/api/domain';
import { HackathonItem, AnalyticsOverviewData } from '@/lib/types';
import { IncidentTrendChart } from '@/components/dashboard/IncidentTrendChart';
import { CategoryBreakdownCard } from '@/components/dashboard/CategoryBreakdownCard';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverviewData | null>(null);
  const [items, setItems] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [analyticsRes, itemsRes] = await Promise.all([
          analyticsApi.getOverview(),
          itemsApi.getItems({ limit: 50, sort: 'createdAt_desc' }),
        ]);
        if (active) {
          setAnalytics(analyticsRes);
          setItems(itemsRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // Compute live GST metrics
  let totalSales = 0;
  let totalTax = 0;
  let intraStateSales = 0;
  let interStateSales = 0;

  items.forEach((item) => {
    const attrs = (item.attributes || {}) as Record<string, unknown>;
    const amount = Number(attrs.grandTotal) || 0;
    const tax = Number(attrs.totalTax) || (amount > 0 ? Math.round(amount * 0.08) : 0);
    totalSales += amount;
    totalTax += tax;
    if (attrs.isInterState) {
      interStateSales += amount;
    } else if (amount > 0) {
      intraStateSales += amount;
    }
  });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                GST Sales & Tax Analytics
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                FY 2025-26
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Real-time Indian retail sales trends, CGST/SGST/IGST breakdown, and customer volume.
            </p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl text-xs font-semibold shadow-xs">
          {(['today', 'week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#E6E9F0] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider">
            TOTAL INVOICED SALES
          </span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2 font-mono">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1">
            ↑ 18.2% from previous month
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E9F0] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider">
            TOTAL GST LIABILITY
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2 font-mono">
            ₹{totalTax.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 font-medium mt-1">
            CGST + SGST + IGST
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E9F0] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider">
            INTRA-STATE REVENUE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-2 font-mono">
            ₹{intraStateSales.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 font-medium mt-1">
            Gujarat (CGST + SGST)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E9F0] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#68728A] uppercase tracking-wider">
            INTER-STATE REVENUE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2 font-mono">
            ₹{interStateSales.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 font-medium mt-1">
            Out-of-State (IGST)
          </span>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <IncidentTrendChart
            activity={analytics?.activity || []}
            total={items.length || analytics?.overview?.total || 0}
            items={items}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <CategoryBreakdownCard
            categories={
              items.length > 0
                ? [
                    {
                      category: 'Gujarat (Intra-State)',
                      count: items.filter(
                        (i) => !(i.attributes as Record<string, unknown> | undefined)?.isInterState
                      ).length,
                    },
                    ...(items.some(
                      (i) => (i.attributes as Record<string, unknown> | undefined)?.isInterState
                    )
                      ? [
                          {
                            category: 'Inter-State (IGST)',
                            count: items.filter(
                              (i) =>
                                (i.attributes as Record<string, unknown> | undefined)?.isInterState
                            ).length,
                          },
                        ]
                      : []),
                  ]
                : analytics?.categories || []
            }
            totalIncidents={items.length || analytics?.overview?.total || 0}
          />
        </div>
      </div>
    </div>
  );
}
