import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../../components/auth/AuthScreen';
import { DefaultTheme } from '../../theme/config';

export default function AuthIndex() {
  const router = useRouter();

  const handleGuestPress = () => {
    router.replace('/home');
  };

  return (
    <AuthScreen
      theme={DefaultTheme}
      onGuestPress={handleGuestPress}
    />
  );
}
