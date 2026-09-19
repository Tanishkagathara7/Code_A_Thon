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
  priority?: string;
  attributes?: Record<string, any>;
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

// ==========================================
// PRODUCTS & INVENTORY TYPES
// ==========================================

export type GSTApplicability = 'taxable' | 'exempt' | 'non_gst';
export type UnitOfMeasurement = 'piece' | 'kg' | 'gram' | 'litre' | 'metre' | 'box' | 'pack' | 'tin' | string;
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductItem {
  id: string;
  _id?: string;
  name: string;
  sku?: string;
  hsnCode?: string;
  category?: string;
  brand?: string;
  description?: string;
  unit: UnitOfMeasurement;
  purchasePrice?: number;
  sellingPrice: number;
  isTaxInclusive?: boolean;
  gstApplicability: GSTApplicability;
  gstRate: number; // 0, 5, 12, 18, 28
  currentStock: number;
  openingStock?: number;
  minStockAlert?: number;
  trackInventory: boolean;
  stockStatus: StockStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockHistoryItem {
  _id?: string;
  product: string;
  operationType: 'initial' | 'purchase_increase' | 'sale_deduction' | 'manual_increase' | 'manual_decrease' | 'damage' | 'return';
  previousQuantity: number;
  quantityDelta: number;
  newQuantity: number;
  reason: string;
  referenceInvoiceNo?: string;
  createdAt: string;
}

export interface ProductSummary {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
}

// ==========================================
// CUSTOMERS & PARTIES TYPES
// ==========================================

export type CustomerType = 'individual' | 'business';

export interface CustomerRecord {
  id: string;
  _id?: string;
  name: string;
  mobile: string;
  email?: string;
  customerType: CustomerType;
  gstin?: string;
  businessName?: string;
  address?: string;
  city?: string;
  state: string;
  stateCode?: string;
  pincode?: string;
  notes?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerProfileData {
  customer: CustomerRecord;
  stats: {
    totalInvoices: number;
    totalBilled: number;
    totalTax: number;
    pendingBalance: number;
  };
  invoices: Array<{
    id: string;
    invoiceNo: string;
    title: string;
    date: string;
    status: string;
    paymentStatus: string;
    grandTotal: number;
    itemsCount: number;
    isInterState: boolean;
  }>;
}

