'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { analyticsApi, itemsApi } from '@/lib/api/domain';
import { AnalyticsOverviewData, HackathonItem } from '@/lib/types';
import { getStatusBadgeStyle, formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverviewData | null>(null);
  const [recentItems, setRecentItems] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [analyticsRes, itemsRes] = await Promise.all([
        analyticsApi.getOverview(),
        itemsApi.getItems({ limit: 5, sort: 'createdAt_desc' }),
      ]);
      setAnalytics(analyticsRes);
      setRecentItems(itemsRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard operational data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overview = analytics?.overview || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl shadow-zinc-950/10">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-800 text-[11px] font-semibold text-indigo-400 border border-zinc-700">
            <Sparkles className="w-3 h-3" />
            <span>Multi-Platform Operations Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Pulse Operator'}
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Real-time synchronization active across mobile (React Native) and desktop (Next.js). View workflow metrics and intelligence below.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Item</span>
          </Link>
        </div>

        {/* Decorative dynamic glows */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => loadData()} className="underline font-semibold ml-4">
            Retry
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Items</span>
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {loading ? '—' : overview.total}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Total entities tracked across devices</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">
              {loading ? '—' : overview.completed}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Successfully finalized tasks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold tracking-tight text-indigo-600">
              {loading ? '—' : overview.inProgress}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Active ongoing operations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Completion Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {loading ? '—' : `${overview.completionRate}%`}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Overall throughput efficiency</div>
        </div>
      </div>

      {/* Main Content Grid: Recent Items & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Items Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">Recent Entity Activity</h3>
              <p className="text-xs text-zinc-500">Live feed of domain records registered on Mobile & Web</p>
            </div>
            <Link
              href="/items"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-zinc-400">Loading live activity...</div>
            ) : recentItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Layers className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-sm font-medium text-zinc-600">No items created yet</p>
                <Link
                  href="/items/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create first item</span>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
                  <tr>
                    <th className="px-6 py-3">Title & Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentItems.map((item) => {
                    const badge = getStatusBadgeStyle(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-zinc-900">{item.title}</div>
                          <div className="text-xs text-zinc-400">{item.category || 'General'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/items/${item.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 group-hover:text-indigo-600"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Side Panel: Category Breakdown & Quick AI Card */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">Category Breakdown</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-xs text-zinc-400">Loading metrics...</div>
              ) : !analytics?.categories || analytics.categories.length === 0 ? (
                <div className="text-xs text-zinc-400">No category data yet.</div>
              ) : (
                analytics.categories.map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-700">{c.category}</span>
                      <span className="text-zinc-900">{c.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (c.count / (overview.total || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick AI Gateway Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-zinc-900 p-6 rounded-2xl text-white space-y-4 shadow-lg shadow-indigo-950/20">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base">AI Copilot Gateway</h4>
              <p className="text-xs text-zinc-300 mt-1">
                Decompose requirements, summarize status logs, and generate actionable operational plans.
              </p>
            </div>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors"
            >
              <span>Launch AI Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
