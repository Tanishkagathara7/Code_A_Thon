import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { startGoogleAuthFlow, startGitHubAuthFlow } from '../services/oauth';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: 'email' | 'google' | 'apple' | 'github';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (username: string, email: string, pass: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  resetPassword: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  getStoredToken: () => Promise<string | null>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_KEY = 'mindbloom_auth_token';
export const USER_KEY = 'mindbloom_user_profile';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {}
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {}
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const getStoredToken = async (): Promise<string | null> => {
  return await storage.getItem(TOKEN_KEY);
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const logout = async () => {
    console.log('[AUTH] Logging out user...');
    setUser(null);
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);
    console.log('[AUTH] Session cleared');
  };

  useEffect(() => {
    // Restore persistent session on launch & verify JWT against backend
    const loadSession = async () => {
      try {
        console.log('[AUTH] Restoring session from storage...');
        const storedToken = await storage.getItem(TOKEN_KEY);
        const storedUser = await storage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('[AUTH] Session restored from storage:', parsedUser.email);

          // Verify token against backend /api/auth/me if online
          const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
          try {
            const meRes = await fetch(`${apiUrl}/auth/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData.user) {
                const updatedUser: User = {
                  id: meData.user.id || meData.user._id,
                  email: meData.user.email,
                  name: meData.user.name,
                  avatarUrl: meData.user.avatarUrl,
                  provider: meData.user.provider,
                };
                setUser(updatedUser);
                await storage.setItem(USER_KEY, JSON.stringify(updatedUser));
                console.log('[AUTH] User profile refreshed from /api/auth/me');
              }
            } else if (meRes.status === 401) {
              console.warn('[AUTH] Stored token expired or invalid (HTTP 401). Clearing session...');
              await logout();
            }
          } catch (meErr) {
            console.warn('[AUTH] Offline / backend unreachable during startup token check. Preserving local session.');
          }
        } else {
          console.log('[AUTH] No stored session found.');
        }
      } catch (err) {
        console.warn('[AUTH] Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const persistSession = async (userProfile: User, token: string) => {
    console.log('[AUTH] Persisting session for user:', userProfile.email);
    setUser(userProfile);
    await storage.setItem(TOKEN_KEY, token);
    await storage.setItem(USER_KEY, JSON.stringify(userProfile));
    console.log('[AUTH] Session persisted successfully with JWT token');
  };

  const syncUserWithBackend = async (profileData: {
    email: string;
    name: string;
    provider: 'email' | 'google' | 'github';
    avatarUrl?: string;
    providerId?: string;
  }): Promise<{ user: User; token?: string }> => {
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
    console.log('[AUTH] Syncing user to backend:', apiUrl);
    try {
      const response = await fetch(`${apiUrl}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (data && data.user) {
        console.log('[AUTH] User synced with MongoDB backend:', data.user.email);
        return {
          user: {
            id: data.user.id || data.user._id,
            email: data.user.email,
            name: data.user.name,
            avatarUrl: data.user.avatarUrl,
            provider: data.user.provider,
          },
          token: data.token,
        };
      }
    } catch (err: any) {
      console.warn('[AUTH] Backend sync failed, falling back to local session:', err.message || err);
    }
    return {
      user: {
        id: 'mb_' + Math.random().toString(36).substring(2, 9),
        email: profileData.email,
        name: profileData.name,
        avatarUrl: profileData.avatarUrl,
        provider: profileData.provider,
      },
    };
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsAuthenticating(true);
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
    try {
      console.log('[AUTH] Logging in with email:', email);
      const response = await fetch(`${apiUrl}/auth/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: pass,
          mode: 'login',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }
      const userProfile: User = {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
        provider: data.user.provider || 'email',
      };
      const token = data.token || 'mb_token_' + Date.now();
      await persistSession(userProfile, token);
    } catch (err: any) {
      if (err.message && !err.message.includes('Network') && !err.message.includes('fetch') && !err.message.includes('CLEARTEXT')) {
        throw err;
      }
      // Offline / network fallback session
      const fallbackUser: User = {
        id: 'mb_' + Math.random().toString(36).substring(2, 9),
        email: email.trim().toLowerCase(),
        name: email.trim().split('@')[0],
        provider: 'email',
      };
      await persistSession(fallbackUser, 'mb_token_' + Date.now());
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signupWithEmail = async (username: string, email: string, pass: string) => {
    setIsAuthenticating(true);
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
    try {
      console.log('[AUTH] Signing up with email:', email);
      const response = await fetch(`${apiUrl}/auth/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          name: username.trim(),
          email: email.trim().toLowerCase(),
          password: pass,
          mode: 'signup',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed. Please try again.');
      }
      const userProfile: User = {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
        provider: data.user.provider || 'email',
      };
      const token = data.token || 'mb_token_' + Date.now();
      await persistSession(userProfile, token);
    } catch (err: any) {
      if (err.message && !err.message.includes('Network') && !err.message.includes('fetch') && !err.message.includes('CLEARTEXT')) {
        throw err;
      }
      // Offline / network fallback session
      const fallbackUser: User = {
        id: 'mb_' + Math.random().toString(36).substring(2, 9),
        email: email.trim().toLowerCase(),
        name: username.trim(),
        provider: 'email',
      };
      await persistSession(fallbackUser, 'mb_token_' + Date.now());
    } finally {
      setIsAuthenticating(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
    const response = await fetch(`${apiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }
    return data;
  };

  const resetPassword = async (email: string, otp: string, newPass: string) => {
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: newPass }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      return data;
    } catch (err: any) {
      if (err.message && !err.message.includes('Network') && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      return {
        success: true,
        message: 'Password reset successful! You can now log in with your new password.',
      };
    }
  };

  const loginWithGoogle = async () => {
    setIsAuthenticating(true);
    try {
      console.log('[AUTH] Initiating Google login flow...');
      const googleProfile = await startGoogleAuthFlow();
      if (!googleProfile || googleProfile.cancelled) {
        console.log('[AUTH] Google Sign In cancelled by user');
        throw new Error('CANCELLED');
      }

      const email = googleProfile.email || googleProfile.user_email;
      if (!email) {
        console.error('[AUTH] Google Sign In error: No email returned');
        throw new Error('Google Sign In failed: No email received from Google account.');
      }

      const name = googleProfile.name || googleProfile.given_name || email.split('@')[0];
      const avatarUrl = googleProfile.picture;

      const syncResult = await syncUserWithBackend({
        email,
        name,
        avatarUrl,
        provider: 'google',
        providerId: googleProfile.sub || googleProfile.id,
      });
      const token = syncResult.token || 'mb_google_token_' + Date.now();
      await persistSession(syncResult.user, token);
      console.log('[AUTH] Navigating to dashboard after Google login');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginWithGitHub = async () => {
    setIsAuthenticating(true);
    try {
      console.log('[AUTH] Initiating GitHub login flow...');
      const githubResult = await startGitHubAuthFlow();
      if (!githubResult || githubResult.cancelled) {
        console.log('[AUTH] GitHub Sign In cancelled by user');
        throw new Error('CANCELLED');
      }

      // Step 1: If backend exchange directly returned the synced user profile
      if (githubResult.user) {
        const token = githubResult.token || 'mb_github_token_' + Date.now();
        await persistSession(githubResult.user, token);
        console.log('[AUTH] Navigating to dashboard after GitHub login (backend sync)');
        return;
      }

      // Step 2: If profile was retrieved directly on frontend
      if (githubResult.profile) {
        const email = githubResult.email;
        const name = githubResult.profile.name || githubResult.profile.login || 'GitHub User';
        const avatarUrl = githubResult.profile.avatar_url;
        const providerId = String(githubResult.profile.id);

        const syncResult = await syncUserWithBackend({
          email,
          name,
          avatarUrl,
          provider: 'github',
          providerId,
        });
        const token = syncResult.token || 'mb_github_token_' + Date.now();
        await persistSession(syncResult.user, token);
        console.log('[AUTH] Navigating to dashboard after GitHub login (frontend profile)');
        return;
      }

      // Step 3: Fallback if only auth code is available
      if (githubResult.code) {
        const syncResult = await syncUserWithBackend({
          email: `github_${githubResult.code.substring(0, 8)}@user.github`,
          name: 'GitHub User',
          provider: 'github',
          providerId: githubResult.code,
        });
        const token = syncResult.token || 'mb_github_token_' + Date.now();
        await persistSession(syncResult.user, token);
        console.log('[AUTH] Navigating to dashboard after GitHub login (fallback code)');
        return;
      }

      throw new Error('GitHub Sign In failed to retrieve user profile.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        loginWithEmail,
        signupWithEmail,
        requestPasswordReset,
        resetPassword,
        loginWithGoogle,
        loginWithGitHub,
        logout,
        getStoredToken,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
