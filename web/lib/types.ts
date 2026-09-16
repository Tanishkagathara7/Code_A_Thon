export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  organization?: string;
  domainProfile?: Record<string, any>;
  avatarUrl?: string;
  provider?: 'email' | 'google' | 'github';
  createdAt?: string;
}

export type ItemStatus = 'pending' | 'in_progress' | 'completed' | string;

export interface HackathonItem {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  status: ItemStatus;
  category?: string;
  priority?: string;
  attributes?: Record<string, unknown>;
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

export interface AnalyticsOverviewMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
}

export interface ActivityMetric {
  date: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | string;
  category: string;
  createdAt: string;
}

export interface AnalyticsOverviewData {
  overview: AnalyticsOverviewMetrics;
  categories: CategoryMetric[];
  activity: ActivityMetric[];
  recentActivity: RecentActivityItem[];
}

export interface AIGeneratePayload {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIGeneratedResult {
  text: string;
  model: string;
  finishReason?: string;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageProvider?: string;
  url: string;
  downloadUrl?: string;
  createdAt: string;
}

export interface AppNotification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
