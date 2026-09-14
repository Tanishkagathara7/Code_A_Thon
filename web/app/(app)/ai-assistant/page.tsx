'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Copy, Check, Terminal, FileText, BrainCircuit } from 'lucide-react';
import { aiApi } from '@/lib/api/domain';
import { useToast } from '@/lib/context/ToastContext';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'summarize' | 'decompose' | 'code'>('summarize');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const presets = {
    summarize: 'Analyze the following meeting notes / requirements and extract core takeaways and bottlenecks.',
    decompose: 'Decompose this strategic initiative into 5 structured, assignable sprint tasks with risk levels.',
    code: 'Review this operational flow and propose a clean TypeScript service interface and schema validation.',
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
    } catch (err: any) {
      toast(err.message || 'AI request failed', 'error');
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OpenRouter AI Gateway</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">AI Intelligence Copilot</h2>
        <p className="text-sm text-zinc-500">
          Synthesize operational logs, draft project specifications, and decompose complex tasks in seconds.
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
                onClick={() => setMode('summarize')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'summarize' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Summarize
              </button>
              <button
                type="button"
                onClick={() => setMode('decompose')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'decompose' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Task Breakdown
              </button>
              <button
                type="button"
                onClick={() => setMode('code')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'code' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Architecture
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Input Context or Raw Text
                </label>
                <textarea
                  rows={8}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste requirements, feature notes, incident logs, or specifications here..."
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
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Analysis</span>
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
              Assisted Workflows
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Executive Summarization with bullet points</span>
              </div>
              <div className="flex items-start gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Automated decomposition into assignable sub-tasks</span>
              </div>
              <div className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Technical architecture and payload schema generation</span>
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
          <div className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
