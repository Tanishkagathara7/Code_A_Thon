'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  History,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  RefreshCw,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { productsApi } from '@/lib/api/domain';
import { ProductItem, GST_SLABS } from '@/lib/types';
import { useToast } from '@/lib/context/ToastContext';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const { toast } = useToast();

  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [summary, setSummary] = useState<{
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalInventoryValue: number;
  }>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalInventoryValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedGstRate, setSelectedGstRate] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<ProductItem | null>(null);
  const [stockHistoryLogs, setStockHistoryLogs] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    hsnCode: string;
    category: string;
    brand: string;
    description: string;
    unit: string;
    purchasePrice: string;
    sellingPrice: string;
    isTaxInclusive: boolean;
    gstApplicability: 'taxable' | 'exempt' | 'non_gst';
    gstRate: number;
    openingStock: string;
    minStockAlert: string;
    trackInventory: boolean;
  }>({
    name: '',
    sku: '',
    hsnCode: '1006',
    category: 'Grains & Pulses',
    brand: '',
    description: '',
    unit: 'piece',
    purchasePrice: '',
    sellingPrice: '',
    isTaxInclusive: false,
    gstApplicability: 'taxable',
    gstRate: 18,
    openingStock: '0',
    minStockAlert: '5',
    trackInventory: true,
  });

  // Adjust Form State
  const [adjustOperation, setAdjustOperation] = useState<'increase' | 'decrease'>('increase');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  // Fetch summary & products
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, prodRes] = await Promise.all([
        productsApi.getSummary(),
        productsApi.getProducts({
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          stockStatus: selectedStockStatus !== 'all' ? selectedStockStatus : undefined,
          gstRate: selectedGstRate !== 'all' ? Number(selectedGstRate) : undefined,
          sort: sortBy,
        }),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (prodRes.success) setProducts(prodRes.data || []);
    } catch (err: any) {
      toast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedStockStatus, selectedGstRate, sortBy, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle open Add modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      hsnCode: '1006',
      category: 'Grains & Pulses',
      brand: '',
      description: '',
      unit: 'piece',
      purchasePrice: '',
      sellingPrice: '',
      isTaxInclusive: false,
      gstApplicability: 'taxable',
      gstRate: 18,
      openingStock: '0',
      minStockAlert: '5',
      trackInventory: true,
    });
    setIsFormOpen(true);
  };

  // Handle open Edit modal
  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku || '',
      hsnCode: prod.hsnCode || '1006',
      category: prod.category || 'General',
      brand: prod.brand || '',
      description: prod.description || '',
      unit: prod.unit || 'piece',
      purchasePrice: prod.purchasePrice ? String(prod.purchasePrice) : '',
      sellingPrice: String(prod.sellingPrice || ''),
      isTaxInclusive: Boolean(prod.isTaxInclusive),
      gstApplicability: prod.gstApplicability || 'taxable',
      gstRate: prod.gstRate ?? 18,
      openingStock: String(prod.openingStock || 0),
      minStockAlert: String(prod.minStockAlert || 5),
      trackInventory: prod.trackInventory !== false,
    });
    setIsFormOpen(true);
  };

  // Handle open Adjust Stock modal
  const handleOpenAdjust = (prod: ProductItem) => {
    setAdjustingProduct(prod);
    setAdjustOperation('increase');
    setAdjustQty('1');
    setAdjustReason('New stock purchased');
    setIsAdjustOpen(true);
  };

  // Handle open Stock History drawer
  const handleOpenHistory = async (prod: ProductItem) => {
    setAdjustingProduct(prod);
    setIsHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const prodId = prod.id || prod._id || '';
      const res = await productsApi.getStockHistory(prodId);
      if (res.success) {
        setStockHistoryLogs(res.data || []);
      }
    } catch (err: any) {
      toast('Failed to load stock audit log', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Submit Product Add / Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast('Product name is required', 'error');
      return;
    }
    const priceNum = Number(formData.sellingPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast('Please enter a valid selling price', 'error');
      return;
    }

    try {
      const payload: any = {
        name: formData.name.trim(),
        sku: formData.sku.trim() || undefined,
        hsnCode: formData.hsnCode.trim() || undefined,
        category: formData.category.trim() || 'General',
        brand: formData.brand.trim() || undefined,
        description: formData.description.trim() || undefined,
        unit: formData.unit,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : 0,
        sellingPrice: priceNum,
        isTaxInclusive: formData.isTaxInclusive,
        gstApplicability: formData.gstApplicability,
        gstRate: Number(formData.gstRate),
        minStockAlert: Number(formData.minStockAlert) || 5,
        trackInventory: formData.trackInventory,
      };

      if (!editingProduct) {
        payload.openingStock = Number(formData.openingStock) || 0;
        await productsApi.createProduct(payload);
        toast('Product added to catalog successfully', 'success');
      } else {
        const prodId = editingProduct.id || editingProduct._id || '';
        await productsApi.updateProduct(prodId, payload);
        toast('Product updated successfully', 'success');
      }

      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to save product', 'error');
    }
  };

  // Submit Stock Adjustment
  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const qty = Number(adjustQty);
    if (isNaN(qty) || qty <= 0) {
      toast('Adjustment quantity must be greater than 0', 'error');
      return;
    }
    if (adjustOperation === 'decrease' && qty > adjustingProduct.currentStock) {
      toast(`Cannot decrease by ${qty}. Available stock is ${adjustingProduct.currentStock}`, 'error');
      return;
    }

    setAdjustSubmitting(true);
    try {
      const prodId = adjustingProduct.id || adjustingProduct._id || '';
      await productsApi.adjustStock(prodId, adjustOperation, qty, adjustReason.trim() || 'Manual adjustment');
      toast(`Stock successfully adjusted for ${adjustingProduct.name}`, 'success');
      setIsAdjustOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to adjust stock', 'error');
    } finally {
      setAdjustSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prod: ProductItem) => {
    if (!confirm(`Are you sure you want to remove "${prod.name}" from your catalog?`)) return;
    try {
      const prodId = prod.id || prod._id || '';
      await productsApi.deleteProduct(prodId);
      toast('Product deleted successfully', 'success');
      loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Standard Category mappings to Statutory HSN/SAC codes & default GST rates
  const CATEGORY_METADATA_MAP: Record<string, { hsn: string; defaultGstRate: number; defaultUnit: string }> = {
    'Grains & Pulses': { hsn: '1006', defaultGstRate: 5, defaultUnit: 'kg' },
    'Edible Oils': { hsn: '1515', defaultGstRate: 5, defaultUnit: 'litre' },
    'Spices & Condiments': { hsn: '0910', defaultGstRate: 5, defaultUnit: 'kg' },
    'Dairy & Bakery': { hsn: '0401', defaultGstRate: 5, defaultUnit: 'pack' },
    'Beverages': { hsn: '2202', defaultGstRate: 18, defaultUnit: 'piece' },
    'Packaged Foods': { hsn: '1905', defaultGstRate: 12, defaultUnit: 'pack' },
    'Personal Care': { hsn: '3304', defaultGstRate: 18, defaultUnit: 'piece' },
    'Cleaning & Household': { hsn: '3402', defaultGstRate: 18, defaultUnit: 'piece' },
    'Stationery & Office': { hsn: '4820', defaultGstRate: 12, defaultUnit: 'piece' },
    'Hardware & Electricals': { hsn: '8536', defaultGstRate: 18, defaultUnit: 'piece' },
    'Textiles & Garments': { hsn: '6203', defaultGstRate: 5, defaultUnit: 'piece' },
    'General': { hsn: '9999', defaultGstRate: 18, defaultUnit: 'piece' },
  };

  const DEFAULT_CATEGORIES = Object.keys(CATEGORY_METADATA_MAP);

  const categoriesList = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [products]);

  // Auto-apply HSN code and GST rate when category changes
  const handleCategoryChange = (newCategory: string) => {
    const trimmed = newCategory.trim();
    const meta = CATEGORY_METADATA_MAP[trimmed];

    if (meta) {
      setFormData((prev) => ({
        ...prev,
        category: newCategory,
        hsnCode: meta.hsn,
        gstRate: meta.defaultGstRate,
        unit: prev.unit === 'piece' ? meta.defaultUnit : prev.unit,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: newCategory,
      }));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Catalog</span>
            <span>/</span>
            <span className="font-semibold text-zinc-900">Products & Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
            Products & Stock Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Configure product-wise GST rates, manage stock inventory levels, and track stock movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 truncate">Total Products</p>
            <p className="text-lg sm:text-xl font-black text-zinc-900 mt-0.5">{summary.totalProducts}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 truncate">Low Stock Alert</p>
            <p className="text-lg sm:text-xl font-black text-amber-600 mt-0.5">{summary.lowStockCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 truncate">Out of Stock</p>
            <p className="text-lg sm:text-xl font-black text-rose-600 mt-0.5">{summary.outOfStockCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400 truncate">Inventory Value</p>
            <p className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">₹{Number(summary.totalInventoryValue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by product, SKU, or HSN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* GST Slabs */}
          <select
            value={selectedGstRate}
            onChange={(e) => setSelectedGstRate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All GST Slabs</option>
            {GST_SLABS.map((rate) => (
              <option key={rate} value={rate}>{rate}% GST</option>
            ))}
          </select>

          {/* Stock Status */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="createdAt_desc">Recently Added</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_desc">Highest Stock</option>
            <option value="stock_asc">Lowest Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50/70 border-b border-zinc-100 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Product Name & SKU</th>
                <th className="px-4 py-3.5">HSN Code</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Selling Price</th>
                <th className="px-4 py-3.5">GST Rate</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-400" />
                    <span>Loading products inventory...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                    <p className="font-medium text-zinc-600">No products found</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Try adjusting your filters or add your first product above.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isLow = p.trackInventory && p.currentStock > 0 && p.currentStock <= (p.minStockAlert || 5);
                  const isOut = p.trackInventory && p.currentStock <= 0;

                  return (
                    <tr key={p.id || p._id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            SKU: {p.sku || 'N/A'} {p.unit ? `• Unit: ${p.unit}` : ''}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
                          {p.hsnCode || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-zinc-600 font-medium">
                        {p.category || 'General'}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-extrabold text-zinc-900">
                          ₹{Number(p.sellingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        {p.purchasePrice ? (
                          <span className="block text-[10px] text-zinc-400">
                            Cost: ₹{Number(p.purchasePrice).toFixed(2)}
                          </span>
                        ) : null}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Percent className="w-3 h-3" />
                          {p.gstRate}% {p.gstApplicability === 'exempt' ? '(Exempt)' : ''}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`font-extrabold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-zinc-900'}`}>
                          {p.trackInventory ? p.currentStock : 'Unlimited'}
                        </span>
                        {p.trackInventory && (
                          <span className="block text-[10px] text-zinc-400">
                            Reorder: {p.minStockAlert || 5}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAdjust(p)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                            title="Adjust Stock"
                          >
                            Adjust Stock
                          </button>
                          <button
                            onClick={() => handleOpenHistory(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                            title="View Stock History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-zinc-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                  <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 text-base sm:text-lg tracking-tight">
                    {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    HSN code, GST rates, unit pricing, and stock alerts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Item Identity */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Product Information</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Product / Item Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Basmati Rice Premium (25kg Bag)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">HSN / SAC Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 1006"
                        value={formData.hsnCode}
                        onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-zinc-700">Category</label>
                        <span className="text-[10px] text-zinc-400">Select or type new</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          list="category-suggestions"
                          placeholder="Select or enter category..."
                          value={formData.category}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium"
                        />
                        <datalist id="category-suggestions">
                          {categoriesList.map((cat) => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Unit (UOM)</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium cursor-pointer"
                      >
                        <option value="piece">Piece (Pcs)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="gram">Gram (g)</option>
                        <option value="litre">Litre (L)</option>
                        <option value="metre">Metre (m)</option>
                        <option value="box">Box / Carton</option>
                        <option value="pack">Pack / Bag</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & GST */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Pricing & GST Rate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Selling Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="1850.00"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono font-bold shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Purchase / Cost (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="1550.00"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">GST Applicability</label>
                    <select
                      value={formData.gstApplicability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gstApplicability: e.target.value as 'taxable' | 'exempt' | 'non_gst',
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium cursor-pointer"
                    >
                      <option value="taxable">Taxable Supply</option>
                      <option value="exempt">Exempt (0% Nil-Rated)</option>
                      <option value="non_gst">Non-GST Goods</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">GST Slab Rate</label>
                    <select
                      value={formData.gstRate}
                      disabled={formData.gstApplicability !== 'taxable'}
                      onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-bold text-emerald-700 cursor-pointer disabled:opacity-50"
                    >
                      {GST_SLABS.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}% GST (Intra: {rate / 2}% + {rate / 2}% | Inter: {rate}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Inventory Control */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">3</span>
                    <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Stock & Inventory</span>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.trackInventory}
                      onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                      className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                    />
                    <span className="font-semibold text-zinc-800">Track Inventory</span>
                  </label>
                </div>

                {formData.trackInventory && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {!editingProduct && (
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Initial Opening Stock</label>
                        <input
                          type="number"
                          placeholder="e.g. 50"
                          value={formData.openingStock}
                          onChange={(e) => setFormData({ ...formData, openingStock: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Low Stock Alert Threshold</label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={formData.minStockAlert}
                        onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADJUST STOCK */}
      {/* ========================================== */}
      {isAdjustOpen && adjustingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="font-extrabold text-zinc-900 text-base">Adjust Stock Inventory</h3>
                <p className="text-xs text-zinc-500">{adjustingProduct.name}</p>
              </div>
              <button
                onClick={() => setIsAdjustOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="pt-4 space-y-4">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Available Stock:</span>
                <span className="font-extrabold text-zinc-900 text-sm">
                  {adjustingProduct.currentStock} {adjustingProduct.unit}s
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustOperation('increase')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      adjustOperation === 'increase'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    + Stock In (Increase)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustOperation('decrease')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      adjustOperation === 'decrease'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    - Stock Out (Decrease)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 10"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchase order PO-442, Damaged in transit, Count correction"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-xs disabled:opacity-50"
                >
                  {adjustSubmitting ? 'Adjusting...' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DRAWER: STOCK AUDIT HISTORY */}
      {/* ========================================== */}
      {isHistoryOpen && adjustingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base">Stock Movement History</h3>
                  <p className="text-xs text-zinc-500">{adjustingProduct.name}</p>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                {historyLoading ? (
                  <div className="py-12 text-center text-xs text-zinc-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-400" />
                    <span>Loading audit movements...</span>
                  </div>
                ) : stockHistoryLogs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-400">
                    <History className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
                    <p>No recorded stock movements yet.</p>
                  </div>
                ) : (
                  stockHistoryLogs.map((log) => {
                    const isPositive = log.quantityDelta > 0;
                    return (
                      <div
                        key={log._id}
                        className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md ${
                              isPositive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isPositive ? `+${log.quantityDelta}` : log.quantityDelta} units
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {new Date(log.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-zinc-700 font-medium">{log.reason}</p>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-200/50">
                          <span>Previous: {log.previousQuantity}</span>
                          <span className="font-bold text-zinc-700">New: {log.newQuantity}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button
              onClick={() => setIsHistoryOpen(false)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
