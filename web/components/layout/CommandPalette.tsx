'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Layers,
  Sparkles,
  FolderOpen,
  Bell,
  Settings,
  ArrowRight,
  ShieldAlert,
  X,
} from 'lucide-react';
import { itemsApi } from '@/lib/api/domain';
import { HackathonItem } from '@/lib/types';
import { domainConfig } from '@/lib/domain.config';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) handleClose();
      } else if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Search items as user types
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await itemsApi.getItems({
          search: query.trim() || undefined,
          limit: 6,
          sort: 'createdAt_desc',
        });
        if (active) {
          setItems(res.data || []);
        }
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Go to Command Center Dashboard', href: '/dashboard', icon: Layers, badge: 'Overview' },
    { label: 'Log New Incident Record', href: '/items/new', icon: Plus, badge: 'Create' },
    { label: 'View All Incident Records', href: '/items', icon: ShieldAlert, badge: 'Triage' },
    { label: 'Launch AI Copilot Workspace', href: '/ai-assistant', icon: Sparkles, badge: 'Intelligence' },
    { label: 'Storage & Incident Assets', href: '/files', icon: FolderOpen, badge: 'Media' },
    { label: 'Operational Notifications', href: '/notifications', icon: Bell, badge: 'Alerts' },
    { label: 'Settings & Profile Preferences', href: '/settings', icon: Settings, badge: 'Account' },
  ];

  const navigate = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#E5E5E7] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E5E7] bg-white gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents, operational commands, or navigation... (Esc to close)"
            className="w-full bg-transparent border-none text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-500">
              ESC
            </span>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-zinc-100">
          {/* Incidents Section */}
          <div className="p-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 mb-1.5">
              <span>{domainConfig.domain.entityPluralName} Records</span>
              {loading && <span className="text-indigo-600 lowercase font-normal">querying...</span>}
            </div>
            {items.length === 0 && !loading && query.trim() ? (
              <div className="px-3 py-4 text-center text-xs text-zinc-400">
                No incidents found matching &ldquo;{query}&rdquo;
              </div>
            ) : items.length > 0 ? (
              <div className="space-y-1">
                {items.map((item, idx) => {
                  const id = item.id || item._id;
                  const isCritical = item.priority === 'urgent' || item.priority === 'high';
                  return (
                    <button
                      key={id || idx}
                      onClick={() => navigate(`/items/${id}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#F4F7FB] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.status === 'completed'
                              ? 'bg-emerald-500'
                              : isCritical
                              ? 'bg-rose-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {item.category || 'General'} • Priority: {item.priority || 'standard'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-zinc-400 group-hover:text-zinc-700 flex items-center gap-1 shrink-0 ml-2">
                        View
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Quick Actions & Navigation */}
          <div className="p-2">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 mb-1.5">
              Command Actions & Navigation
            </div>
            <div className="space-y-1">
              {quickNav.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.href}
                    onClick={() => navigate(action.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#F4F7FB] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-zinc-800 group-hover:text-zinc-950">
                        {action.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      {action.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F7F5EF] border-t border-[#E5E5E7] flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 font-mono text-[10px]">
              Ctrl + K
            </kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 font-mono text-[10px]">
              Esc
            </kbd>
          </div>
          <span className="font-medium text-zinc-700">Pulse Command Center</span>
        </div>
      </div>
    </div>
  );
};
