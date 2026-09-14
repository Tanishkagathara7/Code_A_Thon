export type ItemStatus = 'pending' | 'in_progress' | 'completed' | string;

export interface HackathonItem {
  id: string;
  title: string;
  description?: string;
  status: ItemStatus;
  category?: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'title_asc' | 'title_desc';

export interface ItemListQuery {
  search?: string;
  status?: ItemStatus | string;
  category?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

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
