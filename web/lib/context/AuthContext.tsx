'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { authApi } from '../api/auth';
import { USER_STORAGE_KEY, TOKEN_STORAGE_KEY } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginWithOAuth: (payload: { email: string; name?: string; provider: 'google' | 'github'; providerId?: string; avatarUrl?: string }) => Promise<void>;
  loginWithGitHub: (code: string, redirectUri?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const cached = localStorage.getItem(USER_STORAGE_KEY);
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {}
      }
      // Re-verify with backend
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      }
    } catch {
      // If token is invalid or expired
      setUser(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authApi.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      router.push('/dashboard');
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const res = await authApi.signup(name, email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      router.push('/dashboard');
    }
  };

  const loginWithOAuth = async (payload: { email: string; name?: string; provider: 'google' | 'github'; providerId?: string; avatarUrl?: string }) => {
    const res = await authApi.syncOAuthUser(payload);
    if (res.success && res.user) {
      setUser(res.user);
      router.push('/dashboard');
    }
  };

  const loginWithGitHub = async (code: string, redirectUri?: string) => {
    const res = await authApi.githubLogin(code, redirectUri);
    if (res.success && res.user) {
      setUser(res.user);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithOAuth, loginWithGitHub, logout, refreshUser }}>
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
