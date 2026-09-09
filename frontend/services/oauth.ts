import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

// OAuth Endpoint configurations
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

const GITHUB_AUTH_ENDPOINT = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';

export const OAUTH_CONFIG = {
  google: {
    clientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
  },
  github: {
    clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '',
  },
};

export const getRedirectUri = () => {
  // In a standalone APK build (executionEnvironment is 'standalone' or 'bare'), use custom deep link scheme
  // In Expo Go, use the registered Expo Auth Proxy URL
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const proxyUri = 'https://auth.expo.io/@tanish1901s-team/mindbloom';
  const standaloneUri = AuthSession.makeRedirectUri({ scheme: 'mindbloom' });

  const selectedUri = isExpoGo ? proxyUri : (standaloneUri || proxyUri);
  console.log('🔗 [OAuth] Redirect URI used:', selectedUri, '| isExpoGo:', isExpoGo);
  return selectedUri;
};

const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');
  const queryString =
    hashIndex !== -1
      ? url.substring(hashIndex + 1)
      : queryIndex !== -1
      ? url.substring(queryIndex + 1)
      : '';

  queryString.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
};

export const startGoogleAuthFlow = async () => {
  const redirectUri = getRedirectUri();
  // IMPORTANT: For Expo Go (which uses https://auth.expo.io proxy), Google requires the WEB client ID!
  // The Android client ID is strictly for standalone signed APK/AAB builds.
  const clientId = OAUTH_CONFIG.google.clientIdWeb || OAUTH_CONFIG.google.clientIdAndroid;

  const authUrl = `${GOOGLE_AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${encodeURIComponent('profile email')}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === 'success' && result.url) {
    const params = parseUrlParams(result.url);
    const token = params.access_token;
    if (token) {
      return await fetchGoogleUserProfile(token);
    }
  }
  return null;
};

export const startGitHubAuthFlow = async () => {
  const redirectUri = getRedirectUri();
  const clientId = OAUTH_CONFIG.github.clientId;

  const authUrl = `${GITHUB_AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent('read:user user:email')}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === 'success' && result.url) {
    const params = parseUrlParams(result.url);
    const code = params.code;
    return code;
  }
  return null;
};

export const fetchGoogleUserProfile = async (token: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (err) {
    console.warn('Error fetching Google profile:', err);
    return null;
  }
};

export const fetchGitHubUserProfile = async (token: string) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return await response.json();
  } catch (err) {
    console.warn('Error fetching GitHub profile:', err);
    return null;
  }
};
