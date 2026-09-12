import { apiClient } from './apiClient';
import {
  HackathonItem,
  PaginatedResponse,
  SingleResponse,
  CreateItemPayload,
  UpdateItemPayload,
  ApiSuccessMessageResponse,
  ItemListQuery,
} from '../../types/domain';

export type GetItemsParams = ItemListQuery;

export const hackathonItemApi = {
  async getItems(params: ItemListQuery = {}): Promise<PaginatedResponse<HackathonItem>> {
    return apiClient.get<PaginatedResponse<HackathonItem>>('/items', {
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      category: params.category,
      sort: params.sort,
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
