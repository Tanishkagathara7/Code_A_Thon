import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { EntrySplashLoader } from '../components/common/EntrySplashLoader';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false);

  const handleProceed = () => {
    if (hasFinishedAnimation) return;
    setHasFinishedAnimation(true);

    if (!isLoading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/(auth)');
      }
    }
  };

  React.useEffect(() => {
    if (hasFinishedAnimation && !isLoading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/(auth)');
      }
    }
  }, [hasFinishedAnimation, isLoading, user, router]);

  return <EntrySplashLoader onFinished={handleProceed} />;
}

