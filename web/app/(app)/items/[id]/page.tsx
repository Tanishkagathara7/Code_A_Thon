'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Layers,
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

  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await itemsApi.getItem(id);
      setItem(res.data);
    } catch (err: any) {
      toast(err.message || 'Failed to load item', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!item) return;
    setUpdatingStatus(true);
    try {
      const res = await itemsApi.updateItem(item.id, { status: newStatus });
      setItem(res.data);
      toast(`Status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update status', 'error');
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
    } catch (err: any) {
      toast(err.message || 'Failed to delete item', 'error');
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
    } catch (err: any) {
      toast(err.message || 'AI analysis failed', 'error');
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
            href={`/items/${item.id}/edit`}
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
          {/* Quick Status Control */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Update Entity Status
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={updatingStatus || item.status === 'pending'}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  item.status === 'pending'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mark Pending</span>
                </div>
                {item.status === 'pending' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
              </button>

              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={updatingStatus || item.status === 'in_progress'}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  item.status === 'in_progress'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mark In Progress</span>
                </div>
                {item.status === 'in_progress' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />}
              </button>

              <button
                onClick={() => handleStatusChange('completed')}
                disabled={updatingStatus || item.status === 'completed'}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  item.status === 'completed'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mark Completed</span>
                </div>
                {item.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              System Telemetry
            </h3>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-400">Record ID</span>
              <span className="font-mono text-zinc-700">{item.id.slice(-8)}</span>
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
