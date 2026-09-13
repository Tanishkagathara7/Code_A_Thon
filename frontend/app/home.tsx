import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { InteractiveNavbar, TabKey } from '../components/navigation/InteractiveNavbar';
import { Colors } from '../theme/colors';
import { AISummarizerCard } from '../components/ai';
import { FileUploadDemoCard } from '../components/file/FileUploadDemoCard';
import { analyticsApi } from '../services/api/analyticsApi';
import { AnalyticsOverviewData } from '../types/analytics';
import { DashboardAnalyticsView } from '../components/analytics/DashboardAnalyticsView';


import { NotificationBadge } from '../components/notifications/NotificationBadge';
import { notificationApi } from '../services/api/notificationApi';
import { appConfig } from '../config/appConfig';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticating, logout } = useAuth();
  const { isOffline } = useNetwork();
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsOverviewData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [isStaleAnalytics, setIsStaleAnalytics] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAnalytics = React.useCallback(async () => {
    if (!user) {
      setAnalyticsData(null);
      setAnalyticsLoading(false);
      setIsStaleAnalytics(false);
      return;
    }

    setAnalyticsLoading(true);
    setAnalyticsError(null);

    // If device is offline, attempt to load cached analytics immediately
    if (isOffline) {
      const cached = await analyticsApi.getCachedOverview();
      if (cached) {
        setAnalyticsData(cached);
        setIsStaleAnalytics(true);
        setAnalyticsLoading(false);
        return;
      }
    }

    try {
      const data = await analyticsApi.getOverview();
      setAnalyticsData(data);
      setIsStaleAnalytics(false);
    } catch (err: any) {
      // Fall back to cached data if fetch failed (e.g. timeout or network failure)
      const cached = await analyticsApi.getCachedOverview();
      if (cached) {
        setAnalyticsData(cached);
        setIsStaleAnalytics(true);
      } else {
        setAnalyticsError(err.message || 'Failed to fetch analytics data');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user, isOffline]);

  // Notification State
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = React.useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    if (isOffline) {
      const cached = await notificationApi.getCachedUnreadCount();
      setUnreadCount(cached);
      return;
    }
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      const cached = await notificationApi.getCachedUnreadCount();
      setUnreadCount(cached);
    }
  }, [user, isOffline]);

  React.useEffect(() => {
    fetchAnalytics();
    fetchUnreadCount();
  }, [fetchAnalytics, fetchUnreadCount]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAnalytics(), fetchUnreadCount()]);
    setRefreshing(false);
  }, [fetchAnalytics, fetchUnreadCount]);

  React.useEffect(() => {
    const t8 = Date.now();
    console.log(`[TIMING] T8: Dashboard rendered at ${t8}`);
  }, []);

  // Guest browsing supported when user clicks Skip on login screen
  const handleAuthAction = async () => {
    if (user) {
      try {
        await logout();
        router.replace('/(auth)');
      } catch {
        router.replace('/');
      }
    } else {
      router.replace('/(auth)');
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'home') {
      return (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4F46E5"
              colors={['#4F46E5']}
            />
          }
        >
          {/* User Profile / Guest Summary Card */}
          <Animated.View entering={FadeInDown.duration(250)} style={styles.profileCard}>
            {/* Avatar image or initials */}
            <View style={styles.avatarWrapper}>
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <LinearGradient
                  colors={['#8898DF', '#6D7FD5']}
                  style={styles.avatarPlaceholder}
                >
                  <Text style={styles.avatarText}>
                    {(user?.name?.[0] || user?.email?.[0] || 'G').toUpperCase()}
                  </Text>
                </LinearGradient>
              )}
            </View>

            {/* User Name & Details */}
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>
              {user?.email || 'Browsing in guest mode'}
            </Text>

            {/* Account Metadata Pills */}
            <View style={styles.metaRow}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Provider: </Text>
                <Text style={styles.pillValue}>
                  {user?.provider ? user.provider.toUpperCase() : 'GUEST'}
                </Text>
              </View>
              {user?.id && (
                <View style={styles.pill}>
                  <Text style={styles.pillLabel}>ID: </Text>
                  <Text style={styles.pillValue}>{user.id.slice(0, 10)}...</Text>
                </View>
              )}
            </View>

            {/* Guest Action Button */}
            {!user && (
              <TouchableOpacity
                style={styles.guestLoginButton}
                onPress={() => router.replace('/(auth)')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  style={styles.guestLoginGradient}
                >
                  <Text style={styles.guestLoginText}>Log In / Sign Up to Sync</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Real-time Server-Calculated Analytics & Reusable Dashboard */}
          <DashboardAnalyticsView
            data={analyticsData}
            isLoading={analyticsLoading}
            error={analyticsError}
            onRetry={fetchAnalytics}
            isGuest={!user}
            isStale={isStaleAnalytics}
          />

          {/* Quick Access Domain Items Card */}
          <TouchableOpacity
            style={styles.domainSectionCard}
            onPress={() => router.push('/items')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4F46E5', '#3730A3']}
              style={styles.domainCardGradient}
            >
              <View style={styles.domainCardHeader}>
                <Text style={styles.domainCardBadge}>CRUD DOMAIN</Text>
                <Text style={styles.domainCardArrow}>Explore ›</Text>
              </View>
              <Text style={styles.domainCardTitle}>Manage {appConfig.entityPluralName}</Text>
              <Text style={styles.domainCardSubtitle}>
                View, search, create, update, and delete {appConfig.entityPluralName.toLowerCase()} or custom entities.
              </Text>
            </LinearGradient>
          </TouchableOpacity>


          {/* AI Foundation Reference Feature Card */}
          <AISummarizerCard />

          {/* File & Image Upload Foundation Reference Feature Card */}
          <FileUploadDemoCard />
        </ScrollView>

      );
    }

    // Coming Soon Blank Page for other tabs (Policies, Create, Benefits, Buy)
    const tabTitles: Record<TabKey, string> = {
      home: 'Home',
      policies: 'Policies',
      create: 'Create',
      benefits: 'Benefits',
      buy: 'Buy',
    };

    return (
      <View style={styles.comingSoonContainer}>
        <View style={styles.comingSoonCard}>
          <LinearGradient
            colors={['#8898DF', '#6D7FD5']}
            style={styles.comingSoonBadge}
          >
            <Text style={styles.comingSoonBadgeText}>{tabTitles[activeTab].toUpperCase()}</Text>
          </LinearGradient>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSubtitle}>
            This feature is currently under development. Stay tuned for future updates!
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Atmospheric Twilight Header Background matching Login UI */}
      <LinearGradient
        colors={['#1E274A', '#2D3A6B', '#485897']}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brandTitle}>{appConfig.appName}</Text>
              <Text style={styles.headerSubtitle}>
                {user ? `${appConfig.primaryEntityName} Hub` : 'Guest Mode'}
              </Text>
            </View>

            <View style={styles.headerRightActions}>
              {user && (
                <NotificationBadge unreadCount={unreadCount} />
              )}
              <TouchableOpacity
                onPress={handleAuthAction}
                style={styles.logoutButton}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutText}>{user ? 'Sign Out' : 'Sign In'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content Area */}
      <View style={styles.body}>
        {renderTabContent()}
      </View>

      {/* Interactive Bottom Navbar matching the design with custom purple center button */}
      <InteractiveNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'create') {
            router.push('/items/create');
          } else {
            setActiveTab(tab);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  headerGradient: {
    paddingBottom: 28,
  },
  safeHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  body: {
    flex: 1,
    paddingBottom: 68, // accommodate compact bottom navbar height
  },
  scrollContent: {
    padding: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1E274A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: {
        elevation: 4,
      },
      default: {
        filter: 'drop-shadow(0px 8px 24px rgba(30, 39, 74, 0.08))',
      },
    }),
  },
  avatarWrapper: {
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#6D7FD5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6D7FD5',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1D2B',
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#71788E',
    fontWeight: '500',
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#F0F3FA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E6F2',
  },
  pillLabel: {
    fontSize: 12,
    color: '#71788E',
    fontWeight: '500',
  },
  pillValue: {
    fontSize: 12,
    color: '#4B5568',
    fontWeight: '700',
  },
  guestLoginButton: {
    marginTop: 24,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  guestLoginGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  guestLoginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#1E274A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
      default: {
        filter: 'drop-shadow(0px 6px 18px rgba(30, 39, 74, 0.06))',
      },
    }),
  },
  comingSoonBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 16,
  },
  comingSoonBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1D2B',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  comingSoonSubtitle: {
    fontSize: 13.5,
    color: '#71788E',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  domainSectionCard: {
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {
        filter: 'drop-shadow(0px 6px 16px rgba(79, 70, 229, 0.18))',
      },
    }),
  },
  domainCardGradient: {
    padding: 20,
    borderRadius: 24,
  },
  domainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  domainCardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    letterSpacing: 0.8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  domainCardArrow: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  domainCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  domainCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
