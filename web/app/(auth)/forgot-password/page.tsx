'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, Loader2, CheckSquare, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/lib/context/ToastContext';
import { KineticHeadline } from '@/components/auth/KineticHeadline';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.forgotPassword(email);
      setInfoMsg(res.message || 'Verification code sent to your email.');
      if (res.otp) {
        setInfoMsg(`Dev Mode OTP: ${res.otp}`);
      }
      toast('Verification code sent!', 'success');
      setStep('reset');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to request reset code.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Please enter the verification code and new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.resetPassword(email, otp, newPassword);
      toast(res.message || 'Password reset successful!', 'success');
      router.push('/login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed. Check the code.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      {/* Left / Center Stage: Headline */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
        <KineticHeadline
          mode="reset"
          lines={[
            ['RESTORE', 'ACCESS.'],
            ['VERIFIED', 'SECURITY.'],
          ]}
          subheading="Cryptographic one-time verification protocol to re-establish your secure workspace identity session."
        />

        {/* Security telemetry block */}
        <div className="rounded-2xl border border-black/[0.08] bg-white/70 backdrop-blur-md p-6 shadow-xs max-w-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">Identity Recovery Guard</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Requests are verified using SHA-256 hashed one-time tokens valid for 10 minutes. Ensure you have access to your registered workspace inbox.
          </p>
        </div>
      </div>

      {/* Right Stage: Compact Card */}
      <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
        <div className="w-full max-w-md bg-white rounded-2xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] relative">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>

          <div className="space-y-1 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
              {step === 'request' ? 'Reset password' : 'Enter verification code'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              {step === 'request'
                ? 'We will send a 6-digit verification code to your email.'
                : `Enter code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200/80 flex items-start gap-2">
              <span className="font-semibold font-mono">ERR:</span>
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  6-Digit Verification OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm font-mono tracking-widest text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  New Password (min. 8 chars)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border text-sm text-zinc-900 focus:outline-none transition-all shadow-2xs ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-zinc-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm New Password</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
