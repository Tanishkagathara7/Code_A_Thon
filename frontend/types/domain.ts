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
 * Pagination Metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

/**
 * Custom Error Class for API calls
 */
export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
