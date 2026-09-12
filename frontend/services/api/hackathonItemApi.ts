import { apiClient } from './apiClient';
import {
  HackathonItem,
  PaginatedResponse,
  SingleResponse,
  CreateItemPayload,
  UpdateItemPayload,
  ApiSuccessMessageResponse,
} from '../../types/domain';

export interface GetItemsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const hackathonItemApi = {
  async getItems(params: GetItemsParams = {}): Promise<PaginatedResponse<HackathonItem>> {
    return apiClient.get<PaginatedResponse<HackathonItem>>('/items', {
      page: params.page,
      limit: params.limit,
      search: params.search,
    });
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

  async deleteItem(id: string): Promise<ApiSuccessMessageResponse> {
    return apiClient.delete<ApiSuccessMessageResponse>(`/items/${id}`);
  },
};
