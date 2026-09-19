import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { notificationApi } from '../../services/api/notificationApi';
import { AppNotification } from '../../types/notification';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { AppHeader } from '../../components/navigation/AppHeader';

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (isLoading || isRefreshing || !hasNextPage) return;
    loadNotifications(page + 1);
  };

  const handleNotificationPress = async (notification: AppNotification) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await notificationApi.markAsRead(notification._id);
      } catch {
        // Optimistic update retained
      }
    }

    if (notification.data?.entityId) {
      router.push(`/items/${notification.data.entityId}`);
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
      <StatusBar barStyle="dark-content" />

      {/* Clean White Web Header */}
      <AppHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
        onBack={() => router.back()}
        backText="Back"
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              disabled={isMarkingAll || isOffline}
              style={styles.markAllBtn}
              activeOpacity={0.8}
            >
              {isMarkingAll ? (
                <ActivityIndicator size="small" color="#5B45F5" />
              ) : (
                <Text style={styles.markAllBtnText}>Mark all read</Text>
              )}
            </TouchableOpacity>
          ) : null
        }
      />

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
            <ActivityIndicator size="large" color="#5B45F5" />
            <Text style={styles.loadingText}>Syncing notifications...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => loadNotifications(1)}
              style={styles.retryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.emptyIconBox}>
              <Text style={{ fontSize: 24 }}>🔔</Text>
            </View>
            <Text style={styles.emptyTitle}>No Notifications Yet</Text>
            <Text style={styles.emptySubtitle}>
              You're completely up to date. Incident updates and operational alerts will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <NotificationCard
                notification={item}
                index={index}
                onPress={handleNotificationPress}
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
              hasNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#5B45F5" />
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
    backgroundColor: '#F8F9FC',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
  },
  markAllBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#5B45F5',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#68728A',
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: 'PlusJakartaSans_400Regular',
    maxWidth: 280,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#5B45F5',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  staleNotice: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  staleText: {
    fontSize: 11.5,
    color: '#B45309',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
