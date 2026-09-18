'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';

import { LoadingScreen } from '@/components/loading/LoadingScreen';

function OAuthCallbackContent({ provider }: { provider: 'google' | 'github' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithOAuth, loginWithGitHub } = useAuth();
  const { toast } = useToast();
  const [isReady, setIsReady] = React.useState(false);
  const status = 'Authenticating with ' + (provider === 'google' ? 'Google' : 'GitHub');
  const processedRef = React.useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

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

          processedRef.current = true;

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
          setIsReady(true);
        } else if (provider === 'github') {
          const code = searchParams.get('code');
          if (!code) {
            return;
          }

          processedRef.current = true;

          await loginWithGitHub(code, `${window.location.origin}/auth/callback/github`);
          toast('Signed in with GitHub successfully!', 'success');
          setIsReady(true);
        }
      } catch (err: unknown) {
        console.error('OAuth callback error:', err);
        const msg = err instanceof Error ? err.message : 'Social authentication failed.';
        toast(msg, 'error');
        router.push('/login');
      }
    };

    void handleAuth();
  }, [provider, searchParams, loginWithOAuth, loginWithGitHub, router, toast]);

  return (
    <LoadingScreen
      standalone
      isReady={isReady}
      onExitComplete={() => {
        router.push('/dashboard');
      }}
      statusMessage={status}
    />
  );
}

export function OAuthCallbackPage({ provider }: { provider: 'google' | 'github' }) {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          standalone
          isReady={false}
          statusMessage={`Connecting ${provider === 'google' ? 'Google' : 'GitHub'}...`}
        />
      }
    >
      <OAuthCallbackContent provider={provider} />
    </Suspense>
  );
}
