import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { HackathonItem, SortOption } from '../../types/domain';
import { DomainCard } from '../../components/domain/DomainCard';
import { EmptyState } from '../../components/domain/EmptyState';
import { ErrorState } from '../../components/domain/ErrorState';
import { LoadingState } from '../../components/domain/LoadingState';
import { ConfirmDeleteModal } from '../../components/domain/ConfirmDeleteModal';
import { FilterBar } from '../../components/domain/FilterBar';
import { AppHeader } from '../../components/navigation/AppHeader';

import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { appConfig } from '../../config/appConfig';

export default function ItemListScreen() {
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();

  // Query & Filter State
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSort, setSelectedSort] = useState<SortOption | undefined>('createdAt_desc');

  // List & Pagination State
  const [items, setItems] = useState<HackathonItem[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Status & Loading Flags
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<HackathonItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Ref to track latest request ID for race-condition prevention
  const requestIdRef = useRef<number>(0);

  // 1. Debounce Search Input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const hasActiveFilters =
    !!debouncedSearch.trim() ||
    !!selectedStatus ||
    !!selectedCategory ||
    selectedSort !== 'createdAt_desc';

  // 2. Fetch Items with Query Parameters & Stale Request Protection
  const fetchItems = useCallback(
    async (pageToFetch: number, refresh: boolean = false) => {
      const currentRequestId = ++requestIdRef.current;

      if (refresh) {
        setIsRefreshing(true);
      } else if (pageToFetch > 1) {
        setIsLoadingMore(true);
      } else if (items.length > 0) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await hackathonItemApi.getItems({
          page: pageToFetch,
          limit: 10,
          search: debouncedSearch.trim() || undefined,
          status: selectedStatus,
          category: selectedCategory,
          sort: selectedSort,
        });

        // Check if request is still latest
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (response.data) {
          if (pageToFetch === 1) {
            setItems(response.data);
          } else {
            setItems((prev) => [...prev, ...response.data]);
          }
          setPage(response.pagination?.page || 1);
          setTotalPages(response.pagination?.totalPages || 1);

          // Extract unique categories dynamically
          const cats = Array.from(
            new Set(
              response.data
                .map((item) => item.category)
                .filter((cat): cat is string => !!cat && cat.trim().length > 0)
            )
          );
          setAvailableCategories((prev) => Array.from(new Set([...prev, ...cats])));
        }
      } catch (err: any) {
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || 'Failed to load items. Please pull down to retry.');
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
          setIsSearching(false);
          setIsLoadingMore(false);
          setIsRefreshing(false);
        }
      }
    },
    [debouncedSearch, selectedStatus, selectedCategory, selectedSort]
  );

  // Fetch when filters change
  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handleRefresh = () => {
    fetchItems(1, true);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || isLoading || isRefreshing || isSearching || page >= totalPages) {
      return;
    }
    fetchItems(page + 1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedStatus(undefined);
    setSelectedCategory(undefined);
    setSelectedSort('createdAt_desc');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    if (isOffline) {
      showToast("You're offline. Reconnect to delete this item.", 'error');
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await hackathonItemApi.deleteItem(deleteTarget.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      showToast('Item deleted successfully.', 'info');
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Clean White Web Header */}
      <AppHeader
        title={appConfig.entityPluralName}
        subtitle="Operational Incident Repository"
        onBack={() => router.back()}
        backText="Back"
        rightAction={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/items/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.createBtnText}>+ Create</Text>
          </TouchableOpacity>
        }
      />

      {/* Search Bar Row */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search title, description, or category..."
            placeholderTextColor="#94A3B8"
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#5B45F5" style={styles.searchSpinner} />
          )}
        </View>
      </View>

      {/* Reusable Filter Bar */}
      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        categories={availableCategories}
        onCategoryChange={setSelectedCategory}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main List Body */}
      <View style={styles.body}>
        {isLoading && items.length === 0 ? (
          <LoadingState message={`Fetching ${appConfig.entityPluralName.toLowerCase()}...`} count={3} />
        ) : error && items.length === 0 ? (
          <ErrorState message={error} onRetry={() => fetchItems(1)} />
        ) : items.length === 0 ? (
          <EmptyState
            title={`No ${appConfig.entityPluralName} Found`}
            description={
              hasActiveFilters
                ? 'Try adjusting your filters or search keywords.'
                : `No items exist yet. Create your first ${appConfig.primaryEntityName.toLowerCase()} to get started.`
            }
            actionLabel={hasActiveFilters ? 'Clear Filters' : `Create ${appConfig.primaryEntityName}`}
            onAction={hasActiveFilters ? handleClearFilters : () => router.push('/items/create')}
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <DomainCard
                item={item}
                index={index}
                onPress={() => router.push(`/items/${item.id}`)}
                onEdit={() => router.push(`/items/edit/${item.id}`)}
                onDelete={() => setDeleteTarget(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#5B45F5"
                colors={['#5B45F5']}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.loadMoreFooter}>
                  <ActivityIndicator size="small" color="#5B45F5" />
                  <Text style={styles.loadMoreText}>Loading more...</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        visible={!!deleteTarget}
        title={`Delete ${appConfig.primaryEntityName}`}
        itemTitle={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  createBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#5B45F5',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  searchBarWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    paddingHorizontal: 14,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#101226',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  searchSpinner: {
    marginLeft: 8,
  },
  body: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadMoreFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  loadMoreText: {
    fontSize: 12.5,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
