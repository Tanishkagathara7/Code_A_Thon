import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { notificationApi } from '../../services/api/notificationApi';
import { AppNotification } from '../../types/notification';
import { NotificationCard } from '../../components/notifications/NotificationCard';

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMarkingAll, setIsMarkingAll] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isStaleData, setIsStaleData] = useState<boolean>(false);

  const loadNotifications = useCallback(
    async (pageNum: number = 1, isRefresh: boolean = false) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (!isRefresh && pageNum === 1) {
        setIsLoading(true);
      }
      setError(null);

      // Offline mode fallback: Load cached notifications
      if (isOffline) {
        const cached = await notificationApi.getCachedNotifications();
        const cachedCount = await notificationApi.getCachedUnreadCount();
        if (cached) {
          setNotifications(cached.notifications || []);
          setUnreadCount(cachedCount);
          setIsStaleData(true);
        } else {
          setError('Offline. Connect to internet to view notifications.');
        }
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      try {
        const [data, count] = await Promise.all([
          notificationApi.getNotifications(pageNum, 20),
          notificationApi.getUnreadCount(),
        ]);

        setIsStaleData(false);
        setUnreadCount(count);

        if (pageNum === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        setHasNextPage(data.pagination?.hasNextPage ?? false);
        setPage(pageNum);
      } catch (err: any) {
        // Fallback to cache if network request failed
        const cached = await notificationApi.getCachedNotifications();
        if (cached) {
          setNotifications(cached.notifications || []);
          setIsStaleData(true);
        } else {
          setError(err.message || 'Failed to load notifications');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user, isOffline]
  );

  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading && !isOffline) {
      loadNotifications(page + 1);
    }
  };

  const handleMarkAsRead = async (notification: AppNotification) => {
    if (isOffline) {
      showToast('Cannot update notification state while offline.', 'error');
      return;
    }

    if (!notification.read) {
      try {
        // Optimistic UI update
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await notificationApi.markAsRead(notification._id);
      } catch (err: any) {
        // Revert on error
        loadNotifications(page, true);
        showToast(err.message || 'Failed to mark notification as read', 'error');
      }
    }

    // Navigation handling for entity metadata
    if (notification.data?.entityId && notification.data?.entityType === 'item') {
      try {
        router.push(`/items/${notification.data.entityId}` as any);
      } catch {
        showToast('The linked item could not be opened.', 'error');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isOffline) {
      showToast('Cannot mark all notifications as read while offline.', 'error');
      return;
    }

    if (unreadCount === 0) return;

    try {
      setIsMarkingAll(true);
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      await notificationApi.markAllAsRead();
      showToast('All notifications marked as read', 'success');
    } catch (err: any) {
      loadNotifications(1, true);
      showToast(err.message || 'Failed to mark all notifications as read', 'error');
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Atmospheric twilight header */}
      <LinearGradient
        colors={['#1E274A', '#2D3A6B', '#485897']}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            {/* Title & Unread Count Badge */}
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadPill}>
                  <Text style={styles.unreadPillText}>{unreadCount} unread</Text>
                </View>
              )}
            </View>

            {/* Mark All as Read Button */}
            {unreadCount > 0 ? (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                disabled={isMarkingAll || isOffline}
                style={[
                  styles.markAllButton,
                  isOffline && styles.buttonDisabled,
                ]}
                activeOpacity={0.8}
              >
                {isMarkingAll ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.markAllText}>Mark All Read</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.headerSpacer} />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Body */}
      <View style={styles.body}>
        {isStaleData && (
          <View style={styles.staleNotice}>
            <Text style={styles.staleText}>
              Showing cached notifications offline. Connect to sync.
            </Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : error && notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorTitle}>Unable to Load</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadNotifications(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.emptyIconCircle}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>No Notifications Yet</Text>
            <Text style={styles.emptySubtitle}>
              When items are created, completed, or AI tasks finish, you will receive updates here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <NotificationCard
                notification={item}
                onPress={handleMarkAsRead}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#4F46E5"
                colors={['#4F46E5']}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              hasNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#4F46E5" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  headerGradient: {
    paddingBottom: 18,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  unreadPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  unreadPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  markAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  markAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  headerSpacer: {
    width: 36,
  },
  body: {
    flex: 1,
  },
  staleNotice: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
  },
  staleText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  errorMessage: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
