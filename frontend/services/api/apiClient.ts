import { getStoredToken } from '../../context/AuthContext';
import { ApiError } from '../../types/domain';

const getBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...customOptions } = options;

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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError(
      'Network request failed. Please check your internet connection or server availability.',
      0,
      err
    );
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
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  if (typeof data === 'object' && data !== null && data.success === false) {
    throw new ApiError(data.error || 'Operation failed', response.status, data);
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

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
