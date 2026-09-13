import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { AnalyticsOverviewData } from '../../types/analytics';
import { MetricCard } from './MetricCard';
import { CategoryDistributionChart } from './CategoryDistributionChart';
import { ActivityTrendChart } from './ActivityTrendChart';
import { LoadingState } from '../domain/LoadingState';
import { ErrorState } from '../domain/ErrorState';
import { EmptyState } from '../domain/EmptyState';

export interface DashboardAnalyticsViewProps {
  data: AnalyticsOverviewData | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  isGuest?: boolean;
  isStale?: boolean;
}

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { bg: '#DCFCE7', text: '#15803D', label: 'Completed' };
    case 'in_progress':
      return { bg: '#E0E7FF', text: '#4338CA', label: 'In Progress' };
    case 'pending':
    default:
      return { bg: '#FEF3C7', text: '#B45309', label: 'Pending' };
  }
};

export const DashboardAnalyticsView: React.FC<DashboardAnalyticsViewProps> = ({
  data,
  isLoading,
  error,
  onRetry,
  isGuest = false,
  isStale = false,
}) => {
  const router = useRouter();

  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeaderTitle}>Dashboard Analytics</Text>
        <LoadingState message="Calculating server-side analytics..." count={2} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeaderTitle}>Dashboard Analytics</Text>
        <ErrorState message={error} onRetry={onRetry} />
      </View>
    );
  }

  if (isGuest) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Dashboard Analytics</Text>
        </View>
        <EmptyState
          title="Analytics Available After Login"
          description="Log in or sign up to unlock real-time server-side analytics, category distribution, and completion trends."
          actionLabel="Log In to View Analytics"
          onAction={() => router.replace('/(auth)')}
        />
      </View>
    );
  }

  if (!data || data.overview.total === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Dashboard Analytics</Text>
        </View>

        {/* Render Zero Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <MetricCard
              index={0}
              title="Total Items"
              value={0}
              subtitle="No items created yet"
              gradientColors={['#4F46E5', '#3730A3']}
              icon="📋"
            />
            <MetricCard
              index={1}
              title="Completion Rate"
              value="0%"
              subtitle="0 of 0 completed"
              accentColor="#10B981"
              icon="🎯"
            />
          </View>

          <View style={styles.metricRow}>
            <MetricCard index={2} title="Completed" value={0} accentColor="#16A34A" badge="Done" />
            <MetricCard index={3} title="In Progress" value={0} accentColor="#4F46E5" badge="Active" />
            <MetricCard index={4} title="Pending" value={0} accentColor="#D97706" badge="Queue" />
          </View>
        </View>

        <EmptyState
          title="Start Your Workflow"
          description="You haven't created any items yet. Add your first item to see live analytics and trends update automatically."
          actionLabel="Create First Item"
          onAction={() => router.push('/items/create')}
        />
      </View>
    );
  }

  const { overview, categories, activity, recentActivity } = data;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>Dashboard Analytics</Text>
        <Text style={[styles.liveTag, isStale && styles.staleTag]}>
          {isStale ? 'OFFLINE • CACHED DATA' : 'LIVE API DATA'}
        </Text>
      </View>

      {/* Overview Metrics Cards Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricRow}>
          <MetricCard
            index={0}
            title="Total Domain Items"
            value={overview.total}
            subtitle={`${overview.completed} completed, ${overview.inProgress} active`}
            gradientColors={['#4F46E5', '#3730A3']}
            icon="📋"
          />
          <MetricCard
            index={1}
            title="Completion Rate"
            value={`${overview.completionRate}%`}
            subtitle={`${overview.completed} of ${overview.total} items`}
            badge={overview.completionRate > 50 ? 'Strong' : 'On Track'}
            accentColor="#10B981"
            icon="🎯"
          />
        </View>

        <View style={styles.metricRow}>
          <MetricCard
            index={2}
            title="Completed"
            value={overview.completed}
            accentColor="#16A34A"
            badge="Done"
          />
          <MetricCard
            index={3}
            title="In Progress"
            value={overview.inProgress}
            accentColor="#4F46E5"
            badge="Active"
          />
          <MetricCard
            index={4}
            title="Pending"
            value={overview.pending}
            accentColor="#D97706"
            badge="Queue"
          />
        </View>
      </View>

      {/* Category Distribution Visualization */}
      <CategoryDistributionChart categories={categories} totalCount={overview.total} />

      {/* Activity Trend Visualization */}
      <ActivityTrendChart activity={activity} />

      {/* Recent Activity Section */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/items')}>
            <Text style={styles.viewAllText}>View All ›</Text>
          </TouchableOpacity>
        </View>

        {recentActivity && recentActivity.length > 0 ? (
          recentActivity.map((item, idx) => {
            const statusStyle = getStatusStyle(item.status);
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              : '';

            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(120 + idx * 40).duration(200)}
              >
                <TouchableOpacity
                  style={styles.recentCard}
                  onPress={() => router.push(`/items/${item.id}`)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Recent item: ${item.title}`}
                >
                  <View style={styles.recentCardLeft}>
                    <Text style={styles.recentItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.recentMetaRow}>
                      <View style={styles.catPill}>
                        <Text style={styles.catPillText}>{item.category || 'Uncategorized'}</Text>
                      </View>
                      {dateStr ? <Text style={styles.recentDateText}>{dateStr}</Text> : null}
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        ) : (
          <Text style={styles.noRecentText}>No recent activity items found.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
  },
  liveTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
  },
  staleTag: {
    color: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  metricsGrid: {
    gap: 10,
    marginBottom: 6,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  recentSection: {
    marginTop: 14,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 2px 6px rgba(24, 24, 27, 0.04))',
      },
    }),
  },
  recentCardLeft: {
    flex: 1,
    marginRight: 10,
  },
  recentItemTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  recentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catPill: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  catPillText: {
    fontSize: 11,
    color: '#52525B',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  recentDateText: {
    fontSize: 11.5,
    color: '#A1A1AA',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  noRecentText: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    marginVertical: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
