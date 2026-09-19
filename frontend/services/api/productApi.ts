import { apiClient } from './apiClient';
import {
  ProductItem,
  ProductSummary,
  StockHistoryItem,
  PaginatedResponse,
  SingleResponse,
} from '../../types/domain';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  gstRate?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  sort?: string;
}

export const productApi = {
  async getProducts(params: ProductListParams = {}): Promise<PaginatedResponse<ProductItem>> {
    return apiClient.get<PaginatedResponse<ProductItem>>('/products', params as any);
  },

  async getSummary(): Promise<SingleResponse<ProductSummary>> {
    return apiClient.get<SingleResponse<ProductSummary>>('/products/summary');
  },

  async getProduct(id: string): Promise<SingleResponse<ProductItem & { stockHistory?: StockHistoryItem[] }>> {
    return apiClient.get<SingleResponse<ProductItem & { stockHistory?: StockHistoryItem[] }>>(`/products/${id}`);
  },

  async createProduct(payload: Partial<ProductItem>): Promise<SingleResponse<ProductItem>> {
    return apiClient.post<SingleResponse<ProductItem>>('/products', payload);
  },

  async updateProduct(id: string, payload: Partial<ProductItem>): Promise<SingleResponse<ProductItem>> {
    return apiClient.put<SingleResponse<ProductItem>>(`/products/${id}`, payload);
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/products/${id}`);
  },

  async adjustStock(
    id: string,
    operation: 'increase' | 'decrease',
    quantity: number,
    reason: string
  ): Promise<{ success: boolean; data: ProductItem; history: StockHistoryItem; message: string }> {
    return apiClient.post<{ success: boolean; data: ProductItem; history: StockHistoryItem; message: string }>(
      `/products/${id}/adjust-stock`,
      { operation, quantity, reason }
    );
  },

  async getStockHistory(id: string): Promise<SingleResponse<StockHistoryItem[]>> {
    return apiClient.get<SingleResponse<StockHistoryItem[]>>(`/products/${id}/stock-history`);
  },
};
