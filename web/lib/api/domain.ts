import { apiClient } from './client';
import {
  HackathonItem,
  PaginatedResponse,
  SingleResponse,
  CreateItemPayload,
  UpdateItemPayload,
  ItemListQuery,
  AnalyticsOverviewData,
  AIGeneratePayload,
  AIGeneratedResult,
  UploadedFile,
  AppNotification,
} from '../types';

export const itemsApi = {
  async getItems(params: ItemListQuery = {}): Promise<PaginatedResponse<HackathonItem>> {
    return apiClient.get<PaginatedResponse<HackathonItem>>('/items', params);
  },

  async getItem(id: string): Promise<SingleResponse<HackathonItem>> {
    return apiClient.get<SingleResponse<HackathonItem>>(`/items/${id}`);
  },

  async createItem(payload: CreateItemPayload): Promise<SingleResponse<HackathonItem>> {
    return apiClient.post<SingleResponse<HackathonItem>>('/items', payload);
  },

  async updateItem(id: string, payload: UpdateItemPayload): Promise<SingleResponse<HackathonItem>> {
    return apiClient.put<SingleResponse<HackathonItem>>(`/items/${id}`, payload);
  },

  async deleteItem(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/items/${id}`);
  },
};

export const analyticsApi = {
  async getOverview(): Promise<AnalyticsOverviewData> {
    const res = await apiClient.get<{ success: boolean; data: AnalyticsOverviewData }>('/analytics/overview');
    return res.data;
  },
};

export const aiApi = {
  async generate(payload: AIGeneratePayload): Promise<{ success: boolean; data: AIGeneratedResult }> {
    return apiClient.post<{ success: boolean; data: AIGeneratedResult }>('/ai/generate', payload);
  },

  async summarize(prompt: string, systemPrompt?: string): Promise<{ success: boolean; data: AIGeneratedResult }> {
    return apiClient.post<{ success: boolean; data: AIGeneratedResult }>('/ai/generate', {
      prompt,
      system: systemPrompt || 'You are APP AI, an intelligent workspace copilot. Summarize the text clearly with key takeaways and actionable bullet points.',
    });
  },
};

export const filesApi = {
  async upload(file: File): Promise<{ success: boolean; data: UploadedFile }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ success: boolean; data: UploadedFile }>('/files', formData);
  },

  async getFile(id: string): Promise<{ success: boolean; data: UploadedFile }> {
    return apiClient.get<{ success: boolean; data: UploadedFile }>(`/files/${id}`);
  },

  async deleteFile(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/files/${id}`);
  },
};

export const notificationsApi = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<{ success: boolean; data: AppNotification[] }> {
    return apiClient.get<{ success: boolean; data: AppNotification[] }>('/notifications', { page, limit });
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count');
    return res.data?.count ?? 0;
  },

  async markAsRead(id: string): Promise<any> {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<any> {
    return apiClient.patch('/notifications/read-all');
  },
};
