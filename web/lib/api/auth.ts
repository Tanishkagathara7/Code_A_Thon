import { apiClient, setStoredSession, clearStoredSession, getStoredToken } from './client';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const authApi = {
  async login(email: string, pass: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/email', {
      email,
      password: pass,
      mode: 'login',
    });
    if (res.success && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  async signup(name: string, email: string, pass: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/email', {
      name,
      email,
      password: pass,
      mode: 'signup',
    });
    if (res.success && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    return apiClient.get<{ success: boolean; user: User }>('/auth/me');
  },

  async syncOAuthUser(payload: {
    email: string;
    name?: string;
    provider: 'google' | 'github';
    providerId?: string;
    avatarUrl?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/sync', payload);
    if (res.success && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  async githubLogin(code: string, redirectUri?: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/github', { code, redirectUri });
    if (res.success && res.token) {
      setStoredSession(res.token, res.user);
    }
    return res;
  },

  logout(): void {
    clearStoredSession();
  },

  hasToken(): boolean {
    return Boolean(getStoredToken());
  },
};
