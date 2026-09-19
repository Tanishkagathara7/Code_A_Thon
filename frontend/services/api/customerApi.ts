import { apiClient } from './apiClient';
import {
  CustomerRecord,
  CustomerProfileData,
  PaginatedResponse,
  SingleResponse,
} from '../../types/domain';

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  customerType?: string;
  state?: string;
  sort?: string;
}

export const customerApi = {
  async getCustomers(params: CustomerListParams = {}): Promise<PaginatedResponse<CustomerRecord>> {
    return apiClient.get<PaginatedResponse<CustomerRecord>>('/customers', params as any);
  },

  async getCustomer(id: string): Promise<SingleResponse<CustomerProfileData>> {
    return apiClient.get<SingleResponse<CustomerProfileData>>(`/customers/${id}`);
  },

  async createCustomer(payload: Partial<CustomerRecord>): Promise<SingleResponse<CustomerRecord>> {
    return apiClient.post<SingleResponse<CustomerRecord>>('/customers', payload);
  },

  async updateCustomer(id: string, payload: Partial<CustomerRecord>): Promise<SingleResponse<CustomerRecord>> {
    return apiClient.put<SingleResponse<CustomerRecord>>(`/customers/${id}`, payload);
  },

  async deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/customers/${id}`);
  },
};
