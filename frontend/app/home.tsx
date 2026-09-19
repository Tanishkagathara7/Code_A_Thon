import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { InteractiveNavbar, TabKey } from '../components/navigation/InteractiveNavbar';
import { analyticsApi } from '../services/api/analyticsApi';
import { hackathonItemApi } from '../services/api/hackathonItemApi';
import { notificationApi } from '../services/api/notificationApi';
import { AnalyticsOverviewData } from '../types/analytics';
import { HackathonItem } from '../types/domain';
import { DashboardAnalyticsView } from '../components/analytics/DashboardAnalyticsView';
import { CategoryDistributionChart } from '../components/analytics/CategoryDistributionChart';
import { ActivityTrendChart } from '../components/analytics/ActivityTrendChart';
import { MobileCopilotCard } from '../components/ai/MobileCopilotCard';
import { DashboardRecentIncidents } from '../components/domain/DashboardRecentIncidents';
import { MobileServiceHealth } from '../components/domain/MobileServiceHealth';
import { NotificationBadge } from '../components/notifications/NotificationBadge';
import { ProfileSettingsView } from '../components/profile/ProfileSettingsView';
import { appConfig } from '../config/appConfig';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOffline } = useNetwork();
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Dashboard Data State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsOverviewData | null>(null);
  const [recentItems, setRecentItems] = useState<HackathonItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setAnalyticsLoading(false);
      return;
    }

    setAnalyticsError(null);

    // Instant cache retrieval
    const cached = await analyticsApi.getCachedOverview();
    if (cached) {
      setAnalyticsData(cached);
      setAnalyticsLoading(false);
    }

    if (isOffline) {
      setAnalyticsLoading(false);
      return;
    }

    try {
      const [analyticsRes, itemsRes] = await Promise.all([
        analyticsApi.getOverview(),
        hackathonItemApi.getItems({ limit: 8, sort: 'createdAt_desc' }),
      ]);
      setAnalyticsData(analyticsRes);
      setRecentItems(itemsRes.data || []);
    } catch (err: any) {
      if (!cached) {
        setAnalyticsError(err.message || 'Failed to sync telemetry');
      }
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user, isOffline]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const cached = await notificationApi.getCachedUnreadCount();
    setUnreadCount(cached);

    if (isOffline) return;
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Retain cached count
    }
  }, [user, isOffline]);

  useEffect(() => {
    fetchDashboardData();
    fetchUnreadCount();
  }, [fetchDashboardData, fetchUnreadCount]);

  // Handle app active focus refresh
  useEffect(() => {
    let sub: any;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleFocus = () => {
        fetchDashboardData();
        fetchUnreadCount();
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    } else {
      sub = AppState.addEventListener('change', (state: any) => {
        if (state === 'active') {
          fetchDashboardData();
          fetchUnreadCount();
        }
      });
      return () => sub?.remove?.();
    }
  }, [fetchDashboardData, fetchUnreadCount]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchUnreadCount()]);
    setRefreshing(false);
  }, [fetchDashboardData, fetchUnreadCount]);

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

  const userRole = (user?.role || 'COORDINATOR').toUpperCase();

  const overview = analyticsData?.overview || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  };

  const recentTitles = useMemo(() => recentItems.map((i) => i.title), [recentItems]);

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
              tintColor="#5B45F5"
              colors={['#5B45F5']}
            />
          }
        >
          {/* ========================================================
              1. OPERATIONAL COMMAND CENTER HERO CARD
             ======================================================== */}
          <View style={styles.heroCard}>
            {/* Top Row: Mesh Badge & Role Pill */}
            <View style={styles.heroBadgeRow}>
              <View style={styles.meshPill}>
                <View style={styles.meshPulseDot} />
                <Text style={styles.meshText}>PULSE DISPATCH MESH</Text>
              </View>

              <View style={styles.rolePill}>
                <View style={styles.roleDot} />
                <Text style={styles.roleText}>
                  ROLE: <Text style={styles.roleHighlight}>{userRole}</Text>
                </Text>
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.heroTitle}>Operational Command Center</Text>
            <Text style={styles.heroSubtitle}>
              Monitor incidents across web and mobile, analyze telemetry in real time, and coordinate faster with AI-powered intelligence.
            </Text>

            {/* Action Buttons: Incident Ledger & Log Incident */}
            <View style={styles.heroActionRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/items')}
              >
                <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#68728A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M2 17L12 22L22 17"
                    stroke="#68728A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.secondaryButtonText}>Incident Ledger</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/items/create')}
              >
                <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 5V19M5 12H19"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.primaryButtonText}>Log Incident</Text>
              </TouchableOpacity>
            </View>

            {/* Lifecycle Status Stepper Line matching Web */}
            <View style={styles.lifecycleRow}>
              <View style={styles.stepGroup}>
                <Text style={styles.stepActive}>OBSERVE</Text>
                <Text style={styles.stepDivider}>•</Text>
                <Text style={styles.stepInactive}>INVESTIGATE</Text>
                <Text style={styles.stepDivider}>•</Text>
                <Text style={styles.stepInactive}>RESOLVE</Text>
                <Text style={styles.stepDivider}>•</Text>
                <Text style={styles.stepInactive}>IMPROVE</Text>
              </View>
            </View>
          </View>

          {/* ========================================================
              2. FOUR OPERATIONAL KPI CARDS
             ======================================================== */}
          <DashboardAnalyticsView
            data={analyticsData}
            isLoading={analyticsLoading}
            error={analyticsError}
            onRetry={fetchDashboardData}
            isGuest={!user}
          />

          {/* ========================================================
              3. DARK PULSE AI COPILOT CARD
             ======================================================== */}
          <MobileCopilotCard
            totalIncidents={overview.total}
            activeIncidents={overview.inProgress}
            resolvedIncidents={overview.completed}
            recentTitles={recentTitles}
          />

          {/* ========================================================
              4. LIVE RECENT INCIDENT FEED
             ======================================================== */}
          <DashboardRecentIncidents
            items={recentItems}
            isLoading={analyticsLoading}
          />

          {/* ========================================================
              5. INCIDENT ACTIVITY TREND CHART
             ======================================================== */}
          {analyticsData?.activity && (
            <ActivityTrendChart activity={analyticsData.activity} />
          )}

          {/* ========================================================
              6. CATEGORY BREAKDOWN DONUT / STACK
             ======================================================== */}
          {analyticsData?.categories && (
            <CategoryDistributionChart
              categories={analyticsData.categories}
              totalCount={overview.total}
            />
          )}

          {/* ========================================================
              7. SERVICE HEALTH INFRASTRUCTURE SECTION
             ======================================================== */}
          <MobileServiceHealth />
        </ScrollView>
      );
    }

    if (activeTab === 'ai') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.tabHeadingBox}>
            <Text style={styles.tabHeadingTitle}>AI Intelligence Copilot</Text>
            <Text style={styles.tabHeadingSubtitle}>
              Synthesize operational logs, draft project specifications, and decompose complex tasks.
            </Text>
          </View>
          <MobileCopilotCard
            totalIncidents={overview.total}
            activeIncidents={overview.inProgress}
            resolvedIncidents={overview.completed}
            recentTitles={recentTitles}
          />
        </ScrollView>
      );
    }

    if (activeTab === 'profile') {
      return <ProfileSettingsView />;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Clean Top Navigation Bar matching Web Command Center */}
      <SafeAreaView edges={['top']} style={styles.safeHeaderArea}>
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.appNameText}>{appConfig.appName}</Text>
              <Text style={styles.appSubText}>
                {activeTab === 'profile'
                  ? 'Operator Profile & Settings'
                  : activeTab === 'ai'
                  ? 'Copilot Gateway'
                  : 'Command Console'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {user && <NotificationBadge unreadCount={unreadCount} />}
            <TouchableOpacity
              onPress={() => setActiveTab(activeTab === 'profile' ? 'home' : 'profile')}
              style={styles.profileToggleBtn}
              activeOpacity={0.8}
              accessibilityLabel="Profile & Settings"
            >
              <Text style={styles.profileToggleText}>
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Body Content */}
      <View style={styles.body}>{renderTabContent()}</View>

      {/* Bottom Floating Curvature Navbar */}
      <InteractiveNavbar
        activeTab={activeTab}
        onSelectTab={(tab: TabKey) => {
          if (tab === 'create') {
            router.push('/items/create');
          } else if (tab === 'items') {
            router.push('/items');
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
    backgroundColor: '#F8F9FC',
  },
  safeHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9F0',
  },
  headerBar: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  appNameText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
  },
  appSubText: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#5B45F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B45F5',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  tabHeadingBox: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tabHeadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
  },
  tabHeadingSubtitle: {
    fontSize: 12.5,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 4,
    lineHeight: 18,
  },
  authButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  authButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    ...Platform.select({
      ios: {
        shadowColor: '#101226',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 2px 8px rgba(16, 18, 38, 0.04))',
      },
    }),
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  meshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#101226',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  meshPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16B981',
  },
  meshText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.6,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#5B45F5',
  },
  roleText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#5B45F5',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  roleHighlight: {
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#5B45F5',
    ...Platform.select({
      ios: {
        shadowColor: '#5B45F5',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  lifecycleRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F9',
  },
  stepGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepActive: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.8,
  },
  stepInactive: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.8,
  },
  stepDivider: {
    color: '#CBD5E1',
    fontSize: 10,
  },
});
