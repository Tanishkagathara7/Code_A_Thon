export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: 'email' | 'google' | 'github';
  createdAt?: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  mode?: 'login' | 'signup';
  name?: string;
}

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

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
