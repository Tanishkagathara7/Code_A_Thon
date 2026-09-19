'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Bell,
  Sliders,
  Laptop,
  Save,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { domainConfig } from '@/lib/domain.config';

export default function SettingsProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { toast } = useToast();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [role, setRole] = useState(user?.role || 'operator');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // App & Operational Preferences
  const [telemetryRefresh, setTelemetryRefresh] = useState('10s');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [incidentDigest, setIncidentDigest] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isGuest = Boolean(user?.isGuest || user?.provider === 'guest');
  const providerDisplay = user?.provider ? user.provider.toUpperCase() : (isGuest ? 'GUEST' : 'EMAIL');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      updateProfile({
        name: name.trim() || 'Operator',
        organization: organization.trim() || undefined,
        role: role.trim() || 'operator',
      });
      toast('Profile information updated successfully', 'success');
    } catch {
      toast('Failed to save profile changes', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Account & System
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-xs text-zinc-500 font-medium">Unified Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Settings & Profile
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your personal identity, device session, incident preferences, and notification rules in one place.
          </p>
        </div>

        {/* Action Header Button: Sign Out */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/70 border border-rose-200/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Guest Mode Banner (Mobile Parity) */}
      {isGuest && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-amber-50/60 to-orange-50/40 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-900">You are browsing in Guest Mode</h3>
                <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-800 px-1.5 py-0.5 rounded">
                  LOCAL ONLY
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5 max-w-xl">
                Your incident queries, telemetry views, and local configurations are saved only in this browser session. Log in or create an account to sync across web and mobile Expo app.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span>Log In / Sign Up to Sync</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid: Profile Identity & Quick Credentials (Card 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity Snapshot */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Identity Profile
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {providerDisplay}
              </span>
            </div>

            {/* Avatar & Primary Info */}
            <div className="flex flex-col items-center text-center pt-2 pb-6 border-b border-zinc-100">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white ring-2 ring-indigo-100">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OP'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Active on device">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-zinc-900 mt-3.5">
                {user?.name || 'Operator'}
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate max-w-full px-2">
                {isGuest ? 'Browsing in guest mode' : (user?.email || 'operator@pulse.io')}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 capitalize">
                  {user?.role || 'Operator'}
                </span>
                {user?.organization && (
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-700">
                    {user.organization}
                  </span>
                )}
              </div>
            </div>

            {/* Account Metadata Pills (Mobile Parity) */}
            <div className="pt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500">Domain Authority</span>
                <span className="font-semibold text-zinc-800">{domainConfig.brand.name}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500">Entity Scope</span>
                <span className="font-semibold text-zinc-800">{domainConfig.domain.entityPluralName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-50">
                <span className="text-zinc-500">Authentication</span>
                <span className="font-mono text-[11px] font-semibold text-indigo-600">{providerDisplay}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-500">Device Target</span>
                <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Web Workspace</span>
                </span>
              </div>
            </div>
          </div>

          {/* User ID Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100">
            <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>USER_REF:</span>
              <span className="font-bold text-zinc-600 truncate max-w-[140px]">
                {user?.id || 'GUEST_LOCAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): Edit Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-zinc-900">Personal Information</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Update how your name and operational role appear to team members across incidents.
              </p>
            </div>
            <UserIcon className="w-5 h-5 text-zinc-400" />
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Organization / Unit
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Emergency Logistics Command"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={isGuest ? 'guest@app.local' : (user?.email || '')}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Managed via authentication provider</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="operator">Operator (Standard Triage)</option>
                  <option value="lead">Incident Commander / Lead</option>
                  <option value="coordinator">Field Coordinator</option>
                  <option value="engineer">Technical Specialist</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Operational & Workspace Preferences */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Workspace & Telemetry Preferences</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Fine-tune operational refresh rates, UI telemetry, and audio cues for dispatch operations.
            </p>
          </div>
          <Sliders className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="divide-y divide-zinc-100 text-sm">
          {/* Telemetry Polling Rate */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-800">Telemetry Refresh Cadence</p>
              <p className="text-xs text-zinc-500">
                Frequency at which real-time metric aggregates revalidate from server
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['5s', '10s', '30s', '60s'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setTelemetryRefresh(val);
                    toast(`Telemetry refresh interval set to ${val}`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    telemetryRefresh === val
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Audio Signals */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-800">Operational Sound Signals</p>
              <p className="text-xs text-zinc-500">
                Play subtle audio tones on incoming urgent incidents and copilot dispatch
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                soundEffects ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
              aria-label="Toggle sound signals"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-800">Reduced Motion Mode</p>
              <p className="text-xs text-zinc-500">
                Minimize interface transitions and wave telemetry loops for battery savings
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                reducedMotion ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
              aria-label="Toggle reduced motion"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Alert Dispatch Settings */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Notification Rules</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Control channel routing for urgent incident reports and status resolutions.
            </p>
          </div>
          <Bell className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="divide-y divide-zinc-100 text-sm">
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-800">High-Priority Incident Alerts</p>
              <p className="text-xs text-zinc-500">
                Immediate in-app push and banner on critical triage escalation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPushAlerts(!pushAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                pushAlerts ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
              aria-label="Toggle push alerts"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  pushAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-800">Email Broadcast Digests</p>
              <p className="text-xs text-zinc-500">
                Daily summary of assigned {domainConfig.domain.entityPluralName.toLowerCase()} and resolutions
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                emailAlerts ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
              aria-label="Toggle email digests"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-800">AI Copilot Recommendation Prompts</p>
              <p className="text-xs text-zinc-500">
                Proactive automated suggestion badges when recurring anomalies are detected
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIncidentDigest(!incidentDigest)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                incidentDigest ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
              aria-label="Toggle AI prompts"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  incidentDigest ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
