/**
 * Centralized API client for Next.js Web Client.
 * Handles base URL, auth token injection, structured errors, and standard methods.
 */

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
};

export const TOKEN_STORAGE_KEY = 'pulse_web_token';
export const USER_STORAGE_KEY = 'pulse_web_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save session to localStorage', e);
  }
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number = 500, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, body, ...customOptions } = options;

  let url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getStoredToken();
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...customOptions,
    headers,
    body: isFormData ? body : (body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined),
  });

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && (data?.error || data?.message)) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return request<T>(endpoint, { method: 'GET', params });
  },
  post<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, { method: 'POST', body });
  },
  put<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, { method: 'PUT', body });
  },
  patch<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, { method: 'PATCH', body });
  },
  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
