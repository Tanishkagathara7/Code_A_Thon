import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// Keep native splash screen visible until the application is fully mounted and video starts
SplashScreen.preventAutoHideAsync().catch(() => {});

import { NetworkProvider } from '../context/NetworkContext';
import { ToastProvider } from '../context/ToastContext';
import { NetworkStatusBanner } from '../components/common/NetworkStatusBanner';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <AuthProvider>
          <ToastProvider>
            <NetworkStatusBanner />
            <Stack
              screenOptions={{ headerShown: false, animation: 'fade' }}
            >
              <Stack.Screen name="index" options={{ animation: 'fade' }} />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="home" options={{ animation: 'fade' }} />
              <Stack.Screen name="items/index" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="items/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="items/create" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="items/edit/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="notifications/index" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="oauthredirect" options={{ animation: 'fade' }} />
            </Stack>
          </ToastProvider>
        </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
