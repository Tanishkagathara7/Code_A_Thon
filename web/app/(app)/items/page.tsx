'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { itemsApi } from '@/lib/api/domain';
import { HackathonItem, SortOption, PaginationMeta } from '@/lib/types';
import { getStatusBadgeStyle, formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';

export default function ItemsPage() {
  const [items, setItems] = useState<HackathonItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<SortOption>('createdAt_desc');
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const fetchItems = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const res = await itemsApi.getItems({
        page: pageToFetch,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
        category: category || undefined,
        sort,
      });
      setItems(res.data || []);
      setPagination(
        res.pagination || {
          total: res.data?.length || 0,
          page: pageToFetch,
          limit: 10,
          totalPages: 1,
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch items';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadItems = async () => {
      try {
        const res = await itemsApi.getItems({
          page: 1,
          limit: 10,
          search: search.trim() || undefined,
          status: status || undefined,
          category: category || undefined,
          sort,
        });
        if (active) {
          setItems(res.data || []);
          setPagination(
            res.pagination || {
              total: res.data?.length || 0,
              page: 1,
              limit: 10,
              totalPages: 1,
            }
          );
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch items';
          toast(msg, 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      active = false;
    };
  }, [status, category, sort, search, toast]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemsApi.deleteItem(id);
      toast('Item deleted successfully', 'success');
      fetchItems(pagination.page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete item';
      toast(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Items Operations Hub</h2>
          <p className="text-sm text-zinc-500">
            Search, filter, manage, and inspect domain items synchronized across Mobile & Web.
          </p>
        </div>
        <Link
          href="/items/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Item</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by title or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          />
        </form>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="General">General</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-sm text-zinc-400">Loading domain records...</div>
          ) : items.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Layers className="w-10 h-10 text-zinc-300 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-800">No items found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No items match your query or filters. Create a new item to get started.
              </p>
              <Link
                href="/items/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Item</span>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/70 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((item, index) => {
                  const itemId = item.id || item._id || `item-${index}`;
                  const badge = getStatusBadgeStyle(item.status);
                  return (
                    <tr key={itemId} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/items/${itemId}`} className="font-semibold text-zinc-900 hover:underline">
                          {item.title}
                        </Link>
                        {item.description && (
                          <p className="text-xs text-zinc-400 truncate max-w-md mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                          <Link
                            href={`/items/${itemId}`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
                            title="View Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/items/${itemId}/edit`}
                            className="p-1.5 text-zinc-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="Edit Item"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Showing page <strong>{pagination.page}</strong> of{' '}
              <strong>{pagination.totalPages}</strong> ({pagination.total} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchItems(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchItems(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
