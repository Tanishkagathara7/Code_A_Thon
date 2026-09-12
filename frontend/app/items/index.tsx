import React, { useState, useEffect, useCallback } from 'react';
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
import { HackathonItem } from '../../types/domain';
import { DomainCard } from '../../components/domain/DomainCard';
import { EmptyState } from '../../components/domain/EmptyState';
import { ErrorState } from '../../components/domain/ErrorState';
import { LoadingState } from '../../components/domain/LoadingState';
import { ConfirmDeleteModal } from '../../components/domain/ConfirmDeleteModal';

export default function ItemListScreen() {
  const router = useRouter();

  const [items, setItems] = useState<HackathonItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<HackathonItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchItems = useCallback(
    async (pageToFetch: number, refresh: boolean = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else if (pageToFetch > 1) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await hackathonItemApi.getItems({
          page: pageToFetch,
          limit: 10,
          search: search.trim() || undefined,
        });

        if (refresh || pageToFetch === 1) {
          setItems(response.data || []);
        } else {
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newItems = (response.data || []).filter((i) => !existingIds.has(i.id));
            return [...prev, ...newItems];
          });
        }

        setPage(response.pagination?.page || pageToFetch);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve items from server.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handleRefresh = () => {
    fetchItems(1, true);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || isLoading || isRefreshing || page >= totalPages) {
      return;
    }
    fetchItems(page + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await hackathonItemApi.deleteItem(deleteTarget.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
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

          <Text style={styles.headerTitle}>Domain Items</Text>

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
            placeholder="Search items..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => fetchItems(1)}
            returnKeyType="search"
          />
        </View>
      </LinearGradient>

      {/* List / Content */}
      <View style={styles.body}>
        {isLoading && !isRefreshing ? (
          <LoadingState message="Fetching domain items..." count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchItems(1)} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DomainCard
                item={item}
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
              <EmptyState
                title="No domain items found"
                description="Get started by creating your first item to see it listed here."
                actionLabel="+ Create New Item"
                onAction={() => router.push('/items/create')}
              />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 16,
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
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
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
