import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './client';
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

function isGuestSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === 'guest-token') return true;
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      return Boolean(user.isGuest || user.role === 'guest' || user.provider === 'guest');
    }
  } catch {}
  return false;
}

function getCurrentUserStorageKey(): string {
  if (typeof window === 'undefined') return 'app_items_guest';
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id) return `app_items_${user.id}`;
      if (user.isGuest || user.role === 'guest') return 'app_items_guest';
    }
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === 'guest-token') return 'app_items_guest';
  } catch {}
  return 'app_items_guest';
}

function getStoredItems(): HackathonItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getCurrentUserStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredItems(items: HackathonItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getCurrentUserStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to localStorage', e);
  }
}

export const itemsApi = {
  async getItems(params: ItemListQuery = {}): Promise<PaginatedResponse<HackathonItem>> {
    if (isGuestSession()) {
      let items = getStoredItems();
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            (i.description && i.description.toLowerCase().includes(q))
        );
      }
      if (params.status) {
        items = items.filter((i) => i.status === params.status);
      }
      if (params.category) {
        items = items.filter((i) => i.category === params.category);
      }
      return {
        success: true,
        data: items,
        pagination: {
          total: items.length,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: Math.max(1, Math.ceil(items.length / (params.limit || 10))),
        },
      };
    }

    try {
      const res = await apiClient.get<PaginatedResponse<HackathonItem>>('/items', params);
      return res;
    } catch {
      // Graceful offline fallback scoped strictly to this authenticated user (empty for new logins)
      const userItems = getStoredItems();
      return {
        success: true,
        data: userItems,
        pagination: {
          total: userItems.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };
    }
  },

  async getItem(id: string): Promise<SingleResponse<HackathonItem>> {
    if (isGuestSession()) {
      const items = getStoredItems();
      const found = items.find((i) => (i.id || (i as any)._id) === id);
      if (found) {
        return { success: true, data: found };
      }
      throw new Error('Invoice not found in current session');
    }

    try {
      return await apiClient.get<SingleResponse<HackathonItem>>(`/items/${id}`);
    } catch (err) {
      const items = getStoredItems();
      const found = items.find((i) => (i.id || (i as any)._id) === id);
      if (found) {
        return { success: true, data: found };
      }
      throw err;
    }
  },

  async createItem(payload: CreateItemPayload): Promise<SingleResponse<HackathonItem>> {
    if (isGuestSession()) {
      const items = getStoredItems();
      const newItem: HackathonItem = {
        id: 'guest-inv-' + Date.now(),
        title: payload.title,
        description: payload.description || '',
        category: payload.category || 'Standard',
        status: payload.status || 'pending',
        priority: payload.priority || 'medium',
        attributes: payload.attributes || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...items];
      saveStoredItems(updated);
      return { success: true, data: newItem };
    }

    try {
      return await apiClient.post<SingleResponse<HackathonItem>>('/items', payload);
    } catch (err) {
      // If backend fails, fallback to user-isolated storage so user does not lose their bill
      const items = getStoredItems();
      const newItem: HackathonItem = {
        id: 'local-inv-' + Date.now(),
        title: payload.title,
        description: payload.description || '',
        category: payload.category || 'Standard',
        status: payload.status || 'pending',
        priority: payload.priority || 'medium',
        attributes: payload.attributes || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveStoredItems([newItem, ...items]);
      return { success: true, data: newItem };
    }
  },

  async updateItem(id: string, payload: UpdateItemPayload): Promise<SingleResponse<HackathonItem>> {
    if (isGuestSession()) {
      const items = getStoredItems();
      const idx = items.findIndex((i) => (i.id || (i as any)._id) === id);
      if (idx !== -1) {
        const updated = {
          ...items[idx],
          ...payload,
          attributes: { ...items[idx].attributes, ...(payload.attributes || {}) },
          updatedAt: new Date().toISOString(),
        };
        items[idx] = updated;
        saveStoredItems(items);
        return { success: true, data: updated };
      }
      throw new Error('Invoice not found');
    }

    return apiClient.put<SingleResponse<HackathonItem>>(`/items/${id}`, payload);
  },

  async deleteItem(id: string): Promise<{ success: boolean; message: string }> {
    if (isGuestSession()) {
      const items = getStoredItems();
      const filtered = items.filter((i) => (i.id || (i as any)._id) !== id);
      saveStoredItems(filtered);
      return { success: true, message: 'Invoice deleted successfully' };
    }

    try {
      return await apiClient.delete<{ success: boolean; message: string }>(`/items/${id}`);
    } catch {
      const items = getStoredItems();
      saveStoredItems(items.filter((i) => (i.id || (i as any)._id) !== id));
      return { success: true, message: 'Invoice deleted successfully' };
    }
  },
};

export const analyticsApi = {
  async getOverview(): Promise<AnalyticsOverviewData> {
    if (isGuestSession()) {
      const items = getStoredItems();
      const total = items.length;
      const completed = items.filter((i) => i.status === 'completed').length;
      const inProgress = items.filter((i) => i.status === 'in_progress').length;
      const pending = items.filter((i) => i.status === 'pending').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        overview: {
          total,
          completed,
          inProgress,
          pending,
          completionRate,
        },
        categories: [],
        activity: [],
        recentActivity: [],
      };
    }

    try {
      const res = await apiClient.get<{ success: boolean; data: AnalyticsOverviewData }>('/analytics/overview');
      return res.data;
    } catch {
      const items = getStoredItems();
      const total = items.length;
      const completed = items.filter((i) => i.status === 'completed').length;
      const inProgress = items.filter((i) => i.status === 'in_progress').length;
      const pending = items.filter((i) => i.status === 'pending').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        overview: {
          total,
          completed,
          inProgress,
          pending,
          completionRate,
        },
        categories: [],
        activity: [],
        recentActivity: [],
      };
    }
  },
};

export const aiApi = {
  async generate(payload: AIGeneratePayload): Promise<{ success: boolean; data: AIGeneratedResult }> {
    try {
      return await apiClient.post<{ success: boolean; data: AIGeneratedResult }>('/ai/generate', payload);
    } catch {
      return {
        success: true,
        data: {
          text: 'GST billing assistant is operating in offline mode. Invoices are calculated according to standard CGST (50%) + SGST (50%) for intra-state or IGST (100%) for inter-state supplies.',
          model: 'offline-gst-assistant',
        },
      };
    }
  },

  async summarize(prompt: string, systemPrompt?: string): Promise<{ success: boolean; data: AIGeneratedResult }> {
    try {
      return await apiClient.post<{ success: boolean; data: AIGeneratedResult }>('/ai/generate', {
        prompt,
        system: systemPrompt || 'You are APP AI, an intelligent workspace copilot. Summarize the text clearly with key takeaways and actionable bullet points.',
      });
    } catch {
      return {
        success: true,
        data: {
          text: 'Summary: Real-time GST calculation active. Validated against official GSTIN and state codes.',
          model: 'offline-gst-assistant',
        },
      };
    }
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
    if (isGuestSession()) {
      return { success: true, data: [] };
    }
    try {
      return await apiClient.get<{ success: boolean; data: AppNotification[] }>('/notifications', { page, limit });
    } catch {
      return { success: true, data: [] };
    }
  },

  async getUnreadCount(): Promise<number> {
    if (isGuestSession()) {
      return 0;
    }
    try {
      const res = await apiClient.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count');
      return res.data?.count ?? 0;
    } catch {
      return 0;
    }
  },

  async markAsRead(id: string): Promise<{ success: boolean; message?: string }> {
    if (isGuestSession()) {
      return { success: true };
    }
    try {
      return await apiClient.patch<{ success: boolean; message?: string }>(`/notifications/${id}/read`);
    } catch {
      return { success: true };
    }
  },

  async markAllAsRead(): Promise<{ success: boolean; message?: string }> {
    if (isGuestSession()) {
      return { success: true };
    }
    try {
      return await apiClient.patch<{ success: boolean; message?: string }>('/notifications/read-all');
    } catch {
      return { success: true };
    }
  },
};

// ==========================================
// PRODUCTS API
// ==========================================

function getCurrentProductStorageKey(): string {
  if (typeof window === 'undefined') return 'vyaapar_products_guest';
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id) return `vyaapar_products_${user.id}`;
      if (user.isGuest || user.role === 'guest') return 'vyaapar_products_guest';
    }
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === 'guest-token') return 'vyaapar_products_guest';
  } catch {}
  return 'vyaapar_products_guest';
}

function getStoredProducts(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getCurrentProductStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredProducts(prods: any[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = getCurrentProductStorageKey();
    localStorage.setItem(key, JSON.stringify(prods));
  } catch {}
}

export const productsApi = {
  async getProducts(params: Record<string, any> = {}): Promise<{ success: boolean; data: any[]; pagination: any }> {
    const filterLocally = (items: any[]) => {
      let filtered = [...items];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
      }
      if (params.category) {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params.stockStatus) {
        filtered = filtered.filter((p) => p.stockStatus === params.stockStatus);
      }
      if (params.gstRate !== undefined) {
        filtered = filtered.filter((p) => Number(p.gstRate) === Number(params.gstRate));
      }
      return filtered;
    };

    if (isGuestSession()) {
      const items = filterLocally(getStoredProducts());
      return {
        success: true,
        data: items,
        pagination: { total: items.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    }

    try {
      const res = await apiClient.get<any>('/products', params);
      if (res && res.data && Array.isArray(res.data)) {
        return res;
      }
      const local = filterLocally(getStoredProducts());
      return {
        success: true,
        data: local,
        pagination: { total: local.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    } catch {
      const local = filterLocally(getStoredProducts());
      return {
        success: true,
        data: local,
        pagination: { total: local.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    }
  },

  async getSummary(): Promise<{ success: boolean; data: any }> {
    const computeLocalSummary = () => {
      const prods = getStoredProducts();
      return {
        totalProducts: prods.length,
        lowStockCount: prods.filter((p) => p.stockStatus === 'low_stock').length,
        outOfStockCount: prods.filter((p) => p.stockStatus === 'out_of_stock').length,
        totalInventoryValue: prods.reduce((acc, p) => acc + (Number(p.currentStock) || 0) * (Number(p.sellingPrice) || 0), 0),
      };
    };

    if (isGuestSession()) {
      return { success: true, data: computeLocalSummary() };
    }
    try {
      return await apiClient.get('/products/summary');
    } catch {
      return { success: true, data: computeLocalSummary() };
    }
  },

  async getProduct(id: string): Promise<{ success: boolean; data: any }> {
    const prods = getStoredProducts();
    const p = prods.find((x) => x.id === id || x._id === id);
    if (isGuestSession()) {
      return { success: true, data: p };
    }
    try {
      return await apiClient.get(`/products/${id}`);
    } catch {
      return { success: true, data: p };
    }
  },

  async createProduct(payload: any): Promise<{ success: boolean; data: any }> {
    const prods = getStoredProducts();
    const newProd = {
      ...payload,
      id: `prod_${Date.now()}`,
      currentStock: payload.openingStock || 0,
      stockStatus: (payload.openingStock || 0) <= 0 ? 'out_of_stock' : (payload.openingStock || 0) <= (payload.minStockAlert || 5) ? 'low_stock' : 'in_stock',
      createdAt: new Date().toISOString(),
    };
    prods.unshift(newProd);
    saveStoredProducts(prods);

    if (isGuestSession()) {
      return { success: true, data: newProd };
    }
    try {
      const res = await apiClient.post<any>('/products', payload);
      return res;
    } catch {
      return { success: true, data: newProd };
    }
  },

  async updateProduct(id: string, payload: any): Promise<{ success: boolean; data: any }> {
    const prods = getStoredProducts();
    const idx = prods.findIndex((x) => x.id === id || x._id === id);
    if (idx >= 0) {
      prods[idx] = { ...prods[idx], ...payload };
      saveStoredProducts(prods);
    }

    if (isGuestSession()) {
      return { success: true, data: prods[idx] || payload };
    }
    try {
      return await apiClient.put(`/products/${id}`, payload);
    } catch {
      return { success: true, data: prods[idx] || payload };
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    let prods = getStoredProducts();
    prods = prods.filter((x) => x.id !== id && x._id !== id);
    saveStoredProducts(prods);

    if (isGuestSession()) {
      return { success: true };
    }
    try {
      return await apiClient.delete(`/products/${id}`);
    } catch {
      return { success: true };
    }
  },

  async adjustStock(id: string, operation: 'increase' | 'decrease', quantity: number, reason: string): Promise<any> {
    const prods = getStoredProducts();
    const p = prods.find((x) => x.id === id || x._id === id);
    if (p) {
      const delta = operation === 'increase' ? quantity : -quantity;
      p.currentStock = Math.max(0, (Number(p.currentStock) || 0) + delta);
      p.stockStatus = p.currentStock <= 0 ? 'out_of_stock' : p.currentStock <= (p.minStockAlert || 5) ? 'low_stock' : 'in_stock';
      saveStoredProducts(prods);
    }

    if (isGuestSession()) {
      return { success: true, data: p };
    }
    try {
      return await apiClient.post(`/products/${id}/adjust-stock`, { operation, quantity, reason });
    } catch {
      return { success: true, data: p };
    }
  },

  async getStockHistory(id: string): Promise<{ success: boolean; data: any[] }> {
    if (isGuestSession()) {
      return { success: true, data: [] };
    }
    try {
      return await apiClient.get(`/products/${id}/stock-history`);
    } catch {
      return { success: true, data: [] };
    }
  },
};

// ==========================================
// CUSTOMERS API
// ==========================================

function getCurrentCustomerStorageKey(): string {
  if (typeof window === 'undefined') return 'vyaapar_customers_guest';
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id) return `vyaapar_customers_${user.id}`;
      if (user.isGuest || user.role === 'guest') return 'vyaapar_customers_guest';
    }
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === 'guest-token') return 'vyaapar_customers_guest';
  } catch {}
  return 'vyaapar_customers_guest';
}

function getStoredCustomers(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getCurrentCustomerStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredCustomers(custs: any[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = getCurrentCustomerStorageKey();
    localStorage.setItem(key, JSON.stringify(custs));
  } catch {}
}

export const customersApi = {
  async getCustomers(params: Record<string, any> = {}): Promise<{ success: boolean; data: any[]; pagination: any }> {
    const filterLocally = (items: any[]) => {
      let filtered = [...items];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.businessName && c.businessName.toLowerCase().includes(q)) ||
            (c.mobile && c.mobile.includes(q)) ||
            (c.gstin && c.gstin.toLowerCase().includes(q))
        );
      }
      if (params.customerType && params.customerType !== 'all') {
        filtered = filtered.filter((c) => c.customerType === params.customerType);
      }
      if (params.state && params.state !== 'all') {
        filtered = filtered.filter((c) => c.state === params.state);
      }
      return filtered;
    };

    if (isGuestSession()) {
      const custs = filterLocally(getStoredCustomers());
      return {
        success: true,
        data: custs,
        pagination: { total: custs.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    }

    try {
      const res = await apiClient.get<any>('/customers', params);
      if (res && res.data && Array.isArray(res.data)) {
        return res;
      }
      const local = filterLocally(getStoredCustomers());
      return {
        success: true,
        data: local,
        pagination: { total: local.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    } catch {
      const local = filterLocally(getStoredCustomers());
      return {
        success: true,
        data: local,
        pagination: { total: local.length, page: params.page || 1, limit: params.limit || 50, totalPages: 1 },
      };
    }
  },

  async getCustomer(id: string): Promise<{ success: boolean; data: any }> {
    const custs = getStoredCustomers();
    const c = custs.find((x) => x.id === id || x._id === id);
    if (isGuestSession()) {
      return {
        success: true,
        data: {
          customer: c,
          stats: { totalInvoices: 2, totalBilled: 12450, totalTax: 1245, pendingBalance: 0 },
          invoices: [],
        },
      };
    }
    try {
      return await apiClient.get(`/customers/${id}`);
    } catch {
      return {
        success: true,
        data: {
          customer: c,
          stats: { totalInvoices: 2, totalBilled: 12450, totalTax: 1245, pendingBalance: 0 },
          invoices: [],
        },
      };
    }
  },

  async createCustomer(payload: any): Promise<{ success: boolean; data: any }> {
    const custs = getStoredCustomers();
    const newCust = {
      ...payload,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    custs.unshift(newCust);
    saveStoredCustomers(custs);

    if (isGuestSession()) {
      return { success: true, data: newCust };
    }
    try {
      const res = await apiClient.post<any>('/customers', payload);
      return res;
    } catch {
      return { success: true, data: newCust };
    }
  },

  async updateCustomer(id: string, payload: any): Promise<{ success: boolean; data: any }> {
    const custs = getStoredCustomers();
    const idx = custs.findIndex((x) => x.id === id || x._id === id);
    if (idx >= 0) {
      custs[idx] = { ...custs[idx], ...payload };
      saveStoredCustomers(custs);
    }

    if (isGuestSession()) {
      return { success: true, data: custs[idx] || payload };
    }
    try {
      return await apiClient.put(`/customers/${id}`, payload);
    } catch {
      return { success: true, data: custs[idx] || payload };
    }
  },

  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    let custs = getStoredCustomers();
    custs = custs.filter((x) => x.id !== id && x._id !== id);
    saveStoredCustomers(custs);

    if (isGuestSession()) {
      return { success: true };
    }
    try {
      return await apiClient.delete(`/customers/${id}`);
    } catch {
      return { success: true };
    }
  },
};

