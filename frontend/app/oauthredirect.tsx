import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

export default function OAuthRedirectScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticating } = useAuth();

  useEffect(() => {
    // Complete the WebBrowser AuthSession if pending
    WebBrowser.maybeCompleteAuthSession();

    // If user is already authenticated by AuthContext, navigate to home immediately
    if (user) {
      console.log('[AUTH] User authenticated on redirect screen, navigating to home...');
      router.replace('/home');
      return;
    }

    // Only redirect back to login if session restoration and active auth flows are finished and user is still null
    if (!isLoading && !isAuthenticating && !user) {
      const timer = setTimeout(() => {
        if (!user && !isAuthenticating) {
          console.log('[AUTH] No user session found after auth flow completed, returning to auth screen...');
          router.replace('/(auth)');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, isAuthenticating, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.text}>Completing authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D111F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
