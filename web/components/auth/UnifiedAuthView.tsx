'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { KineticHeadline } from '@/components/auth/KineticHeadline';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { domainConfig } from '@/lib/domain.config';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export function UnifiedAuthView({ initialMode = 'signin' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const authConfig = domainConfig.productSpec?.authExperience;
  const initialRole = authConfig?.availableRoles?.[0]?.id || 'coordinator';
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [organization, setOrganization] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setError(null);
    setMode(newMode);
    setConfirmPassword('');
    window.history.replaceState(null, '', newMode === 'signin' ? '/login' : '/signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await login(email, password);
        setIsSuccess(true);
        toast('Authenticated successfully', 'success');
      } else {
        await signup(name, email, password, {
          role: selectedRole,
          organization: organization || undefined,
        });
        setIsSuccess(true);
        toast('Workspace created successfully!', 'success');
      }
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (mode === 'signin' ? 'Invalid credentials' : 'Failed to create workspace');
      setError(msg);
      toast(msg, 'error');
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '878949461550-qkl6f8n7k2n1lnveen5uofs6ddb654j9.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/google`);
    const scope = encodeURIComponent('email profile openid');
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  };

  const handleGitHubAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23lijRkAOA5aBGuvDL';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/github`);
    const scope = encodeURIComponent('read:user user:email');
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      {/* LEFT / HERO SECTION (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
        {/* Kinetic Animated Typography */}
        <KineticHeadline
          mode={mode}
          lines={
            mode === 'signin'
              ? [
                  ['AUTHORITATIVE', 'SESSION'],
                  ['ON', 'WEB', 'AND', 'MOBILE.'],
                ]
              : [
                  ['JOIN', 'THE', 'CODE-A-THON.'],
                  ['ENTER.', 'BUILD.', 'SHIP.'],
                ]
          }
          subheading="One shared Express backend, cryptographically secure JWT authentication, and zero latency across React Native Expo and Next.js 14 workspaces."
        />

        {/* Seamless Background-less Code-A-Thon Logo Presentation */}
        <div className="relative pt-2 pb-2">
          {/* Transparent / Background-less container */}
          <div className="relative aspect-[2083/755] w-full max-w-xl flex items-center justify-start">
            <Image
              src="/code.png"
              alt="Code-A-Thon"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-contain object-left filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* RIGHT AUTH CARD (5 cols) */}
      <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
        <div className="w-full max-w-md bg-white rounded-2xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] relative">
          {/* Animated top indicator bar with smooth expansion and laser glow */}
          <div className="absolute top-0 inset-x-8 h-[2px] overflow-hidden rounded-full">
            <style>{`
              @keyframes expandLine {
                0% {
                  transform: scaleX(0);
                  opacity: 0;
                }
                50% {
                  opacity: 1;
                }
                100% {
                  transform: scaleX(1);
                  opacity: 1;
                }
              }
              @keyframes shimmerBeam {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(200%);
                }
              }
            `}</style>
            <div
              style={{
                animation: 'expandLine 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
                transformOrigin: 'left center',
              }}
              className={`w-full h-full relative transition-colors duration-500 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500'
              }`}
            >
              {/* Laser sheen pulse across the line */}
              <div
                style={{
                  animation: 'shimmerBeam 2.4s ease-in-out 1.2s infinite',
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              />
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 transition-all duration-300">
              {mode === 'signin' ? `Sign in to ${domainConfig.brand.name}` : `Join ${domainConfig.brand.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              {mode === 'signin'
                ? `Enter credentials to access the ${domainConfig.brand.name} operations center.`
                : `Set up your profile to enter the ${domainConfig.brand.name} workspace.`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200/80 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="font-semibold font-mono">ERR:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Role & Org selection in Sign Up Mode */}
            {mode === 'signup' && (
              <>
                {authConfig?.requireRoleSelectionOnSignup && authConfig.availableRoles?.length > 0 && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Select Your Operational Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {authConfig.availableRoles.map((role: any) => {
                        const isSelected = selectedRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 ring-2 ring-indigo-600/10'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                            }`}
                          >
                            <div className="text-xs font-bold">{role.name}</div>
                            <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{role.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Organization / Affiliation
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. City Response Command or Regional Ops"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
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
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator in Sign Up Mode */}
              {mode === 'signup' && <PasswordStrengthMeter password={password} />}
            </div>

            {/* Confirm Password (Sign Up Mode Only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">
                  Confirm Password
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
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-all shadow-2xs ${
                      confirmPassword && confirmPassword !== password
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
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading || isSuccess}
              className={`group w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] mt-4 ${
                isSuccess
                  ? 'bg-emerald-600'
                  : 'bg-zinc-950 hover:bg-zinc-800'
              } disabled:opacity-75`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Social OAuth Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-zinc-400">
              <span className="bg-white px-2.5">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons: Google & GitHub */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-zinc-50/80 border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-800 transition-all shadow-xs hover:border-zinc-300 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleGitHubAuth}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Mode Switcher Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
