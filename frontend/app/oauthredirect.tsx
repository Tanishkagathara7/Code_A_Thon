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
      router.replace('/home');
      return;
    }

    // Only redirect back to login if session restoration and active auth flows are finished and user is still null
    if (!isLoading && !isAuthenticating && !user) {
      router.replace('/(auth)');
    }
  }, [user, isLoading, isAuthenticating, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#0F172A" />
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
