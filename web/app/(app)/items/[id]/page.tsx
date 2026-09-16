'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { itemsApi, aiApi } from '@/lib/api/domain';
import { HackathonItem } from '@/lib/types';
import { getStatusBadgeStyle, formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';
import { domainConfig } from '@/lib/domain.config';

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();

  const [item, setItem] = useState<HackathonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchItem = async () => {
      try {
        const res = await itemsApi.getItem(id);
        if (active) {
          setItem(res.data);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to load item';
          toast(msg, 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchItem();

    return () => {
      active = false;
    };
  }, [id, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!item) return;
    setUpdatingStatus(true);
    try {
      const res = await itemsApi.updateItem(id, { status: newStatus });
      setItem(res.data);
      toast(`Status updated to ${newStatus}`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      toast(msg, 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    try {
      await itemsApi.deleteItem(id);
      toast('Item deleted successfully', 'success');
      router.push('/items');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete item';
      toast(msg, 'error');
    }
  };

  const handleAiDeepDive = async () => {
    if (!item) return;
    setAnalyzing(true);
    try {
      const res = await aiApi.generate({
        prompt: `Analyze this item and give a risk evaluation and 3 key milestones for completion:\nTitle: ${item.title}\nCategory: ${item.category}\nCurrent Status: ${item.status}\nDetails: ${item.description || 'No description'}`,
        system: 'You are an elite agile operations analyst. Provide a sharp, executive-ready breakdown.',
      });
      if (res.data?.text) {
        setAiAnalysis(res.data.text);
        toast('AI Intelligence Analysis generated', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI analysis failed';
      toast(msg, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
        <span>Loading item details...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-zinc-600 font-semibold">Item not found</p>
        <Link href="/items" className="text-xs text-indigo-600 underline">
          Return to Items Hub
        </Link>
      </div>
    );
  }

  const badge = getStatusBadgeStyle(item.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/items"
            className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                {item.category || 'General'}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">{item.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/items/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 shadow-sm cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Description & Specifications
              </h3>
              <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {item.description || (
                  <span className="italic text-zinc-400">No detailed description provided yet.</span>
                )}
              </div>
            </div>

            {/* AI Assistant Action */}
            <div className="pt-6 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Copilot Analysis</span>
                </div>
                <button
                  onClick={handleAiDeepDive}
                  disabled={analyzing}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? 'Analyzing with OpenRouter...' : 'Generate AI Risk & Milestones'}
                </button>
              </div>

              {aiAnalysis && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-zinc-50 border border-indigo-100 text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Metadata & Quick Status Changer */}
        <div className="space-y-6">
          {/* Dynamic Workflow Status Controls */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Workflow & Status Actions
            </h3>
            <div className="flex flex-col gap-2">
              {domainConfig.domain.statuses.map((statusOpt) => {
                const isCurrent = item.status === statusOpt.key;
                return (
                  <button
                    key={statusOpt.key}
                    onClick={() => handleStatusChange(statusOpt.key)}
                    disabled={updatingStatus || isCurrent}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isCurrent
                        ? `${statusOpt.bg} ${statusOpt.text} font-bold ring-1 ring-inset ring-black/10`
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isCurrent ? `Current: ${statusOpt.label}` : `Transition to ${statusOpt.label}`}</span>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              System Telemetry
            </h3>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-400">Record ID</span>
              <span className="font-mono text-zinc-700">{(item.id || item._id || id).slice(-8)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-400">Created</span>
              <span className="text-zinc-700">{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Last Modified</span>
              <span className="text-zinc-700">{formatDate(item.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
