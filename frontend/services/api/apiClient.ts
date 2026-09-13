import { getStoredToken } from '../../context/AuthContext';
import { ApiError, ApiErrorKind } from '../../types/domain';

const getBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
};

const DEFAULT_TIMEOUT_MS = 12000;
const MAX_GET_RETRIES = 1;
const RETRY_DELAY_MS = 1000;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  skipRetry?: boolean;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function singleFetch(url: string, config: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      throw new ApiError(
        'The server is taking too long to respond. Please try again.',
        0,
        err,
        'TIMEOUT'
      );
    }
    throw new ApiError(
      "You're offline. Check your internet connection and try again.",
      0,
      err,
      'NETWORK'
    );
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, timeoutMs = DEFAULT_TIMEOUT_MS, skipRetry = false, ...customOptions } = options;

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

  const token = await getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  const config: RequestInit = {
    ...customOptions,
    headers,
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const method = (config.method || 'GET').toUpperCase();
  const canRetry = method === 'GET' && !skipRetry;

  let response: Response | null = null;
  let lastError: any = null;

  for (let attempt = 0; attempt <= (canRetry ? MAX_GET_RETRIES : 0); attempt++) {
    try {
      if (attempt > 0) {
        await delay(RETRY_DELAY_MS);
      }
      response = await singleFetch(url, config, timeoutMs);
      break;
    } catch (err: any) {
      lastError = err;
      if (!canRetry || attempt >= MAX_GET_RETRIES) {
        throw err;
      }
    }
  }

  if (!response) {
    throw lastError || new ApiError('Request failed to complete.', 0, null, 'UNKNOWN');
  }

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && data?.error) ||
      (typeof data === 'object' && data?.message) ||
      (response.status >= 500
        ? 'Something went wrong on the server. Please try again.'
        : `Request failed with status ${response.status}`);
    const kind: ApiErrorKind = response.status >= 500 ? 'SERVER' : response.status >= 400 ? 'CLIENT' : 'UNKNOWN';
    throw new ApiError(errorMessage, response.status, data, kind);
  }

  if (typeof data === 'object' && data !== null && data.success === false) {
    throw new ApiError(data.error || 'Operation failed', response.status, data, 'CLIENT');
  }

  return data as T;
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options?: Omit<RequestOptions, 'params'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET', params });
  },

  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
