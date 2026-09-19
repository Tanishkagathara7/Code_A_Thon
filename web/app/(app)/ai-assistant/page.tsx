'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Terminal, FileText, BrainCircuit } from 'lucide-react';
import { aiApi } from '@/lib/api/domain';
import { useToast } from '@/lib/context/ToastContext';
import { MarkdownView } from '@/components/ui/MarkdownView';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'gst_audit' | 'hsn_lookup' | 'payment_notice'>('gst_audit');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const presets = {
    gst_audit: 'You are an Indian GST Tax and Compliance expert. Review this invoice, tax rate, or scenario for statutory compliance under CGST/SGST/IGST laws, Place of Supply rules, and reconciliation best practices.',
    hsn_lookup: 'You are a GST classification specialist. Identify the appropriate 4 to 8 digit HSN/SAC code, standard statutory GST slab (0%, 5%, 12%, 18%, 28%), and reverse charge applicability for the following items/services.',
    payment_notice: 'Draft a polite, professional, and firm payment reminder / Khata statement notice in English and Hindi for this customer balance with invoice reference and payment details.',
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast('Please provide instructions or text to analyze', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await aiApi.generate({
        prompt: prompt.trim(),
        system: presets[mode],
      });
      if (res.data?.text) {
        setResult(res.data.text);
        toast('AI generation complete', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI request failed';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GST Intelligence Copilot</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">AI Tax & Billing Assistant</h2>
        <p className="text-sm text-zinc-500">
          Verify GST slabs, look up HSN/SAC codes, audit inter-state rules, and generate khata balance notices in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Config & Input Form */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            {/* Mode selection tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setMode('gst_audit')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'gst_audit' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                GST Rule Audit
              </button>
              <button
                type="button"
                onClick={() => setMode('hsn_lookup')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'hsn_lookup' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                HSN & Rate Finder
              </button>
              <button
                type="button"
                onClick={() => setMode('payment_notice')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'payment_notice' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Khata Payment Notice
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                  {mode === 'hsn_lookup' ? 'Item / Commodity Description' : mode === 'gst_audit' ? 'Invoice / Transaction Details' : 'Customer Balance & Invoice Ref'}
                </label>
                <textarea
                  rows={7}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === 'hsn_lookup'
                      ? 'e.g. Basmati Rice 25kg, Stainless Steel Kitchen Sinks, Software SaaS consulting...'
                      : mode === 'gst_audit'
                      ? 'e.g. Shop in Gujarat selling ₹50,000 electronics to Mumbai buyer with GSTIN 27AA... Is IGST mandatory?'
                      : 'e.g. Rajesh Traders owes ₹18,450 for Invoice INV-2026-4420 dated 10 days ago...'
                  }
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing with GST AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Run GST Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Feature Info */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Supported Workflows
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Inter vs Intra-state CGST+SGST / IGST validation</span>
              </div>
              <div className="flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Official HSN/SAC code lookup & applicable GST slabs</span>
              </div>
              <div className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Bilingual payment reminders with invoice details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-zinc-900">Generated Synthesis</h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="pt-1">
            <MarkdownView content={result} />
          </div>
        </div>
      )}
    </div>
  );
}
