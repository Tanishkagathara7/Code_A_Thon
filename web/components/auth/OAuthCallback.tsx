'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';

function OAuthCallbackContent({ provider }: { provider: 'google' | 'github' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithOAuth, loginWithGitHub } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState('Authenticating with ' + (provider === 'google' ? 'Google' : 'GitHub') + '...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (provider === 'google') {
          // Google implicit grant returns access_token in hash (#access_token=...)
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');

          if (!accessToken) {
            throw new Error('No access token returned from Google.');
          }

          // Fetch userinfo from Google
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userInfo = await userInfoRes.json();

          if (!userInfo.email) {
            throw new Error('Google account did not return an email address.');
          }

          // Sync with backend
          await loginWithOAuth({
            email: userInfo.email,
            name: userInfo.name,
            provider: 'google',
            providerId: userInfo.sub,
            avatarUrl: userInfo.picture,
          });

          toast('Signed in with Google successfully!', 'success');
          router.push('/dashboard');
        } else if (provider === 'github') {
          const code = searchParams.get('code');
          if (!code) {
            throw new Error('No authorization code returned from GitHub.');
          }

          await loginWithGitHub(code, `${window.location.origin}/auth/callback/github`);
          toast('Signed in with GitHub successfully!', 'success');
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        toast(err.message || 'Social authentication failed.', 'error');
        router.push('/login');
      }
    };

    handleAuth();
  }, [provider, searchParams, loginWithOAuth, loginWithGitHub, router, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-900 px-4">
      <div className="bento-card p-8 max-w-sm w-full text-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <h3 className="text-base font-bold tracking-tight text-zinc-900">
          Connecting your account
        </h3>
        <p className="text-xs text-zinc-500 font-mono">
          {status}
        </p>
      </div>
    </div>
  );
}

export function OAuthCallbackPage({ provider }: { provider: 'google' | 'github' }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      }
    >
      <OAuthCallbackContent provider={provider} />
    </Suspense>
  );
}
