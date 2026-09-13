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
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { HackathonItem, SortOption } from '../../types/domain';
import { DomainCard } from '../../components/domain/DomainCard';
import { EmptyState } from '../../components/domain/EmptyState';
import { ErrorState } from '../../components/domain/ErrorState';
import { LoadingState } from '../../components/domain/LoadingState';
import { ConfirmDeleteModal } from '../../components/domain/ConfirmDeleteModal';
import { FilterBar } from '../../components/domain/FilterBar';

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

        // Ignore response if a newer search/filter request was fired (race condition protection)
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        const newItems = response.data || [];

        if (refresh || pageToFetch === 1) {
          setItems(newItems);
        } else {
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const uniqueIncoming = newItems.filter((i) => !existingIds.has(i.id));
            return [...prev, ...uniqueIncoming];
          });
        }

        setPage(response.pagination?.page || pageToFetch);
        setTotalPages(response.pagination?.totalPages || 1);

        // Dynamically collect unique categories for filter options
        if (newItems.length > 0) {
          const cats = Array.from(
            new Set(newItems.map((i) => i.category).filter((c): c is string => !!c && c.trim() !== ''))
          );
          if (cats.length > 0) {
            setAvailableCategories((prev) => Array.from(new Set([...prev, ...cats])));
          }
        }
      } catch (err: any) {
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || 'Failed to retrieve items from server.');
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

  // Trigger fetch when query parameters change (resets to page 1)
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1E274A', '#2D3A6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{appConfig.entityPluralName}</Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/items/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.createBtnText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search title, description, or category..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.searchSpinner} />
          )}
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
      </LinearGradient>

      {/* List / Content */}
      <View style={styles.body}>
        {isLoading && !isRefreshing ? (
          <LoadingState message={`Fetching ${appConfig.entityPluralName.toLowerCase()}...`} count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchItems(1)} />
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
                colors={['#4F46E5']}
                tintColor="#4F46E5"
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              hasActiveFilters ? (
                <EmptyState
                  title="No items match your search"
                  description="No items match the selected search keywords or filters. Try adjusting or clearing your filters."
                  actionLabel="Clear All Filters"
                  onAction={handleClearFilters}
                />
              ) : (
                <EmptyState
                  title={`No ${appConfig.entityPluralName.toLowerCase()} found`}
                  description={`Get started by creating your first ${appConfig.primaryEntityName.toLowerCase()} to see it listed here.`}
                  actionLabel={`+ Create New ${appConfig.primaryEntityName}`}
                  onAction={() => router.push('/items/create')}
                />
              )
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#4F46E5" />
                  <Text style={styles.footerLoaderText}>Loading more items...</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        visible={!!deleteTarget}
        itemTitle={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E274A',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  createBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#6366F1',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  searchSpinner: {
    marginLeft: 8,
  },
  body: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  listContent: {
    padding: 16,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
