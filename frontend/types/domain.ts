/**
 * Core Domain Model Definition
 * Reference implementation for HackathonItem / generic domain entities.
 */
export type ItemStatus = 'pending' | 'in_progress' | 'completed' | string;

export interface DomainEntity {
  id: string;
  title: string;
  description?: string;
  status: ItemStatus;
  category?: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

export type HackathonItem = DomainEntity;

/**
 * Search, Filter & Sort Query State
 */
export type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'title_asc' | 'title_desc';

export interface ItemListQuery {
  search?: string;
  status?: ItemStatus | string;
  category?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}


/**
 * API Response Interfaces
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiSuccessMessageResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Payload Interfaces
 */
export interface CreateItemPayload {
  title: string;
  description?: string;
  status?: ItemStatus;
  category?: string;
}

export interface UpdateItemPayload {
  title?: string;
  description?: string;
  status?: ItemStatus;
  category?: string;
}

export type ApiErrorKind = 'NETWORK' | 'TIMEOUT' | 'CLIENT' | 'SERVER' | 'UNKNOWN';

/**
 * Custom Error Class for API calls with structured error classification
 */
export class ApiError extends Error {
  status?: number;
  data?: any;
  kind: ApiErrorKind;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(message: string, status?: number, data?: any, kind?: ApiErrorKind) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.kind = kind || ApiError.deriveKind(status, message);
    this.isNetworkError = this.kind === 'NETWORK';
    this.isTimeout = this.kind === 'TIMEOUT';
  }

  static deriveKind(status?: number, message?: string): ApiErrorKind {
    if (status === 0 || message?.toLowerCase().includes('network') || message?.toLowerCase().includes('failed to fetch') || message?.toLowerCase().includes('offline')) {
      return 'NETWORK';
    }
    if (message?.toLowerCase().includes('timeout') || message?.toLowerCase().includes('taking too long') || message?.toLowerCase().includes('aborted')) {
      return 'TIMEOUT';
    }
    if (status && status >= 400 && status < 500) {
      return 'CLIENT';
    }
    if (status && status >= 500) {
      return 'SERVER';
    }
    return 'UNKNOWN';
  }
}
