'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, Loader2, CheckSquare } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/lib/context/ToastContext';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    } catch (err: any) {
      setError(err.message || 'Failed to request reset code.');
      toast(err.message || 'Request failed', 'error');
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
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.resetPassword(email, otp, newPassword);
      toast(res.message || 'Password reset successful!', 'success');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Check the code.');
      toast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          {step === 'request' ? 'Reset your password' : 'Enter verification code'}
        </h2>
        <p className="text-xs text-zinc-500 font-normal">
          {step === 'request'
            ? 'We will send a 6-digit OTP code to verify your account.'
            : `Enter the 6-digit code sent to ${email} and choose a new password.`}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200">
          {error}
        </div>
      )}

      {infoMsg && (
        <div className="p-3 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{infoMsg}</span>
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold disabled:opacity-50 mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              6-Digit Code (OTP)
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
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm font-mono tracking-widest text-zinc-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              New Password (min 6 chars)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold disabled:opacity-50 mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Confirm New Password</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
