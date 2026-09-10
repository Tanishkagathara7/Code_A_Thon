import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { EntrySplashLoader } from '../components/common/EntrySplashLoader';

export default function Index() {
  const { user, isLoading, isAuthenticating } = useAuth();
  const router = useRouter();
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false);

  const handleProceed = () => {
    if (hasFinishedAnimation) return;
    setHasFinishedAnimation(true);

    if (!isLoading && !isAuthenticating) {
      if (user) {
        console.log('[AUTH] Splash screen finished: user authenticated -> home');
        router.replace('/home');
      } else {
        console.log('[AUTH] Splash screen finished: unauthenticated -> auth screen');
        router.replace('/(auth)');
      }
    }
  };

  React.useEffect(() => {
    if (hasFinishedAnimation && !isLoading && !isAuthenticating) {
      if (user) {
        console.log('[AUTH] Session restored: navigating to home');
        router.replace('/home');
      } else {
        console.log('[AUTH] No session: navigating to auth screen');
        router.replace('/(auth)');
      }
    }
  }, [hasFinishedAnimation, isLoading, isAuthenticating, user, router]);

  return <EntrySplashLoader onFinished={handleProceed} />;
}

