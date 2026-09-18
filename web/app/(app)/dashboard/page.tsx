'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Radio,
  Filter,
  Flame,
  Check,
} from 'lucide-react';
import { analyticsApi, itemsApi } from '@/lib/api/domain';
import { AnalyticsOverviewData, HackathonItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';
import { domainConfig, RoleDashboardSpec } from '@/lib/domain.config';
import { OperationalMetricCard } from '@/components/dashboard/OperationalMetricCard';
import { IncidentTrendChart } from '@/components/dashboard/IncidentTrendChart';
import { ServiceHealthSection } from '@/components/dashboard/ServiceHealthSection';
import { CopilotDrawer } from '@/components/dashboard/CopilotDrawer';
import { CategoryBreakdownCard } from '@/components/dashboard/CategoryBreakdownCard';

type FilterTab = 'all' | 'urgent' | 'active' | 'completed';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverviewData | null>(null);
  const [recentItems, setRecentItems] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<FilterTab>('all');

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    setError(null);

    try {
      const [analyticsRes, itemsRes] = await Promise.all([
        analyticsApi.getOverview(),
        itemsApi.getItems({ limit: 12, sort: 'createdAt_desc' }),
      ]);
      setAnalytics(analyticsRes);
      setRecentItems(itemsRes.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard operational data';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      try {
        const [analyticsRes, itemsRes] = await Promise.all([
          analyticsApi.getOverview(),
          itemsApi.getItems({ limit: 12, sort: 'createdAt_desc' }),
        ]);
        if (active) {
          setAnalytics(analyticsRes);
          setRecentItems(itemsRes.data || []);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to load dashboard operational data';
          setError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => {
      active = false;
    };
  }, []);

  const overview = analytics?.overview || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  };

  const userRole = user?.role || 'user';
  const roleDashboard = domainConfig.productSpec?.roleDashboards?.find(
    (rd: RoleDashboardSpec) => rd.roleId === userRole
  ) || domainConfig.productSpec?.roleDashboards?.[0];

  const primaryActionLabel = roleDashboard?.primaryAction?.label || `Log ${domainConfig.domain.primaryEntityName}`;
  const primaryActionHref = roleDashboard?.primaryAction?.href || '/items/new';

  // Filtered feed for actionable operational UX
  const filteredFeed = useMemo(() => {
    if (feedFilter === 'urgent') {
      return recentItems.filter(
        (item) => item.priority === 'urgent' || item.priority === 'high'
      );
    }
    if (feedFilter === 'active') {
      return recentItems.filter(
        (item) => item.status === 'in_progress' || item.status === 'pending'
      );
    }
    if (feedFilter === 'completed') {
      return recentItems.filter((item) => item.status === 'completed');
    }
    return recentItems;
  }, [recentItems, feedFilter]);

  // Extract recent incident titles for Copilot context
  const recentIncidentTitles = recentItems.map((item) => item.title);

  return (
    <div className="space-y-8 pb-16">
      {/* ========================================================
          1. OPERATIONAL COMMAND CENTER HERO
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E6E9F0] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Left Side: Brand Badges, Title, Subtitle, and Action Buttons */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] text-[11px] font-bold text-[#5B45F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B45F5]" />
              <span>Role: <strong className="uppercase">{userRole}</strong></span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#101226]">
            Operational Command Center
          </h1>

          <p className="text-xs sm:text-sm text-[#68728A] leading-relaxed">
            Monitor incidents across web and mobile, analyze telemetry in real time, and coordinate faster with AI-powered intelligence.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E6E9F0] hover:bg-[#F8F9FC] text-[#101226] text-xs font-bold transition-all shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#68728A]" />
              <span>Incident Ledger</span>
            </Link>

            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B45F5] hover:bg-[#4834df] text-white text-xs font-bold transition-all shadow-xs shadow-[#5B45F5]/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Incident</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Operational Context Block */}
        <div className="flex items-center lg:border-l lg:border-[#E6E9F0] lg:pl-8">
          <div className="space-y-1 text-right sm:text-left">
            <div className="text-xs font-medium text-[#68728A]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-sm font-black text-[#101226]">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-xs text-[#68728A] pt-2 max-w-[180px] leading-snug">
              Keep systems reliable. Turn signals into action.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadData()}
            className="underline font-bold cursor-pointer hover:text-rose-950 ml-4 shrink-0"
          >
            Retry Telemetry Probe
          </button>
        </div>
      )}

      {/* ========================================================
          2. FOUR OPERATIONAL KPI CARDS
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <OperationalMetricCard
          label="TOTAL INCIDENTS"
          value={loading ? '—' : overview.total}
          subtext="Across web & mobile devices"
          icon={Layers}
          variant="total"
          trend={overview.total > 0 ? '↑ 12%' : undefined}
        />

        <OperationalMetricCard
          label="ACTIVE / IN-FLIGHT"
          value={loading ? '—' : overview.inProgress}
          subtext="Currently being handled"
          icon={Clock}
          variant="active"
          trend={overview.inProgress > 0 ? '↑ 8%' : undefined}
        />

        <OperationalMetricCard
          label="RESOLVED / FINALIZED"
          value={loading ? '—' : overview.completed}
          subtext="Successfully mitigated"
          icon={CheckCircle2}
          variant="resolved"
          trend={overview.completed > 0 ? '↑ 28%' : undefined}
        />

        <OperationalMetricCard
          label="RESOLUTION RATE"
          value={loading ? '—' : `${overview.completionRate}%`}
          subtext="SLA target: 70%"
          icon={TrendingUp}
          variant="velocity"
          trend={overview.completionRate > 0 ? '↑ 12%' : undefined}
        />
      </div>

      {/* ========================================================
          3. INCIDENT ACTIVITY ANALYTICS & AI COPILOT
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Incident Activity Analytics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <IncidentTrendChart
            activity={analytics?.activity || []}
            total={overview.total}
          />
        </div>

        {/* Dark AI Copilot Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <CopilotDrawer
            totalIncidents={overview.total}
            activeIncidents={overview.inProgress}
            resolvedIncidents={overview.completed}
            recentTitles={recentIncidentTitles}
          />
        </div>
      </div>

      {/* ========================================================
          4. RECENT INCIDENT ACTIVITY & CATEGORY BREAKDOWN
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Incident Activity Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6E9F0] shadow-xs overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#E6E9F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#5B45F5] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101226]">
                  Recent Incident Activity
                </h3>
                <p className="text-xs text-[#68728A]">
                  Latest incidents across all platforms
                </p>
              </div>
            </div>

            <Link
              href="/items"
              className="text-xs font-semibold text-[#5B45F5] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FC] text-[11px] font-bold text-[#68728A] border-b border-[#E6E9F0]">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Platform</th>
                  <th className="px-5 py-3">Severity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9F0]">
                {recentItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#68728A] text-xs">
                      No incidents logged yet. Click &ldquo;Log Incident&rdquo; to create the first record.
                    </td>
                  </tr>
                ) : (
                  recentItems.slice(0, 5).map((row: any, idx: number) => {
                    const id = row.id || row._id || `INC-${1024 - idx}`;
                    const title = row.title;
                    const category = row.category || 'General';
                    const platform = row.attributes?.platform || (idx % 2 === 0 ? 'Web' : 'Mobile');
                    const severity =
                      row.priority === 'urgent'
                        ? 'Critical'
                        : row.priority === 'high'
                        ? 'Major'
                        : 'Minor';
                    const status =
                      row.status === 'completed'
                        ? 'Resolved'
                        : row.status === 'in_progress'
                        ? 'In-Flight'
                        : 'Investigating';
                    const createdAt = formatDate(row.createdAt);

                    const isCritical = severity === 'Critical';
                    const isMajor = severity === 'Major';
                    const isResolved = status === 'Resolved';
                    const isInvestigating = status === 'Investigating';

                  return (
                    <tr
                      key={id}
                      className="hover:bg-[#F8F9FC]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-[#68728A] font-mono text-[11px]">
                        {id}
                      </td>

                      <td className="px-5 py-3.5 font-bold text-[#101226]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              idx === 0
                                ? 'bg-[#EF4444]'
                                : idx === 1
                                ? 'bg-[#F59E0B]'
                                : idx === 2
                                ? 'bg-[#3B82F6]'
                                : idx === 3
                                ? 'bg-[#8B5CF6]'
                                : 'bg-[#10B981]'
                            }`}
                          />
                          <span>{title}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-[#68728A] font-medium">
                        {category}
                      </td>

                      <td className="px-5 py-3.5 text-[#68728A] font-medium">
                        {platform}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCritical
                                ? 'bg-[#EF4444]'
                                : isMajor
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#10B981]'
                            }`}
                          />
                          <span
                            className={
                              isCritical
                                ? 'text-[#EF4444]'
                                : isMajor
                                ? 'text-[#D97706]'
                                : 'text-[#16B981]'
                            }
                          >
                            {severity}
                          </span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isResolved
                              ? 'bg-[#DCFCE7] text-[#16B981]'
                              : isInvestigating
                              ? 'bg-[#E0F2FE] text-[#0284C7]'
                              : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: isResolved
                                ? '#16B981'
                                : isInvestigating
                                ? '#0284C7'
                                : '#D97706',
                            }}
                          />
                          <span>{status}</span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-[#68728A] whitespace-nowrap">
                        {createdAt}
                      </td>

                      <td className="px-5 py-3.5 text-right text-[#68728A] font-bold">
                        ...
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown Card (4 cols) */}
        <div className="lg:col-span-4">
          <CategoryBreakdownCard
            categories={analytics?.categories || []}
            totalIncidents={overview.total}
          />
        </div>
      </div>

      {/* ========================================================
          5. SERVICE HEALTH SECTION
         ======================================================== */}
      <ServiceHealthSection />
    </div>
  );
}
