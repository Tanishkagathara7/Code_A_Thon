'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  FileText,
  Search,
  MessageSquare,
} from 'lucide-react';
import { aiApi } from '@/lib/api/domain';
import { useToast } from '@/lib/context/ToastContext';
import { MarkdownView } from '@/components/ui/MarkdownView';

interface CopilotDrawerProps {
  totalIncidents?: number;
  activeIncidents?: number;
  resolvedIncidents?: number;
  recentTitles?: string[];
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  totalIncidents = 24,
  activeIncidents = 6,
  resolvedIncidents = 18,
  recentTitles = [],
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const runCopilot = async (customPrompt: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await aiApi.generate({
        prompt: customPrompt,
        system:
          'You are Pulse AI Copilot, an operational incident commander assistant. Provide concise, high-impact bulleted summaries and clear operational directives.',
      });
      if (res.data?.text) {
        setResponse(res.data.text);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Copilot request failed';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    runCopilot(prompt.trim());
    setPrompt('');
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-4 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden h-full">
      <div className="space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#5B45F5] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#101226]">GST AI Copilot</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[10px] font-bold text-[#16A34A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  Online
                </span>
              </div>
              <p className="text-xs text-[#68728A] mt-0.5">
                Statutory GST audit, tax slab guidance & party khata advisory.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              runCopilot(
                `Summarize today's GST billing performance: ${totalIncidents} total invoices generated, ${activeIncidents} credit/due accounts pending collection, ${resolvedIncidents} paid in full. Recent invoices: ${recentTitles.join(', ') || 'Basmati Rice 25kg, Refined Oil 15L'}. Provide immediate financial insights.`
              )
            }
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#EEF2F6] border border-[#E6E9F0] text-xs font-semibold text-[#101226] transition-colors text-left cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#5B45F5] shrink-0" />
            <span className="truncate">Summarize sales</span>
          </button>

          <button
            type="button"
            onClick={() =>
              runCopilot(
                `Analyze GST tax rates (5%, 12%, 18%) and HSN compliance among recent bills: ${recentTitles.join(', ') || 'Basmati Rice 25kg, Refined Oil 15L, Electrical LED Tube'}. Advise on CGST/SGST vs IGST audit risks.`
              )
            }
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#EEF2F6] border border-[#E6E9F0] text-xs font-semibold text-[#101226] transition-colors text-left cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#5B45F5] shrink-0" />
            <span className="truncate">Tax & HSN audit</span>
          </button>

          <button
            type="button"
            onClick={() =>
              runCopilot(
                `Draft a credit collection reminder notice and payment ledger follow-up for customers with outstanding khata dues (${activeIncidents} unpaid bills out of ${totalIncidents} total).`
              )
            }
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#EEF2F6] border border-[#E6E9F0] text-xs font-semibold text-[#101226] transition-colors text-left cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#5B45F5] shrink-0" />
            <span className="truncate">Khata reminder</span>
          </button>
        </div>

        {/* Output area when generating */}
        {loading && (
          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0] text-xs text-[#5B45F5] flex items-center justify-center gap-2 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#5B45F5]" />
            <span>Analyzing operational streams...</span>
          </div>
        )}

        {/* AI Result Card */}
        {response && !loading && (
          <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E6E9F0] text-xs text-[#101226] space-y-2">
            <div className="flex items-center justify-between border-b border-[#E6E9F0] pb-2 text-[11px] text-[#68728A]">
              <span className="font-bold text-[#5B45F5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Copilot Response
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#68728A] hover:text-[#101226] font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto pr-1 leading-relaxed text-xs text-[#334155]">
              <MarkdownView content={response} />
            </div>
          </div>
        )}
      </div>

      {/* Input Field with Purple Action Button */}
      <form onSubmit={handleSubmit} className="pt-4 relative z-10 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask GST Copilot about taxes, HSN, or ledgers..."
            className="w-full bg-[#F8F9FC] border border-[#E6E9F0] text-[#101226] placeholder:text-[#68728A] px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5B45F5]/20 focus:border-[#5B45F5] font-sans transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-9 h-9 rounded-xl bg-[#5B45F5] hover:bg-[#4834df] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-xs"
          title="Send to GST Copilot"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
