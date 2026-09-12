import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, isLoading, isAuthenticating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Hide native splash screen immediately
    SplashScreen.hideAsync().catch(() => {});

    if (!isLoading && !isAuthenticating) {
      if (user) {
        console.log('[AUTH] User authenticated -> home');
        router.replace('/home');
      } else {
        console.log('[AUTH] Unauthenticated -> onboarding');
        router.replace('/onboarding');
      }
    }
  }, [user, isLoading, isAuthenticating, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0F172A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
