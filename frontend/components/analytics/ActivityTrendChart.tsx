import React from 'react';
import { StyleSheet, View, Text, Platform, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityMetric } from '../../types/analytics';

export interface ActivityTrendChartProps {
  activity: ActivityMetric[];
}

export const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({ activity }) => {
  if (!activity || activity.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity Trend</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyText}>No recent activity logged yet.</Text>
        </View>
      </View>
    );
  }

  const maxCount = Math.max(...activity.map((a) => a.count), 1);
  const totalActivity = activity.reduce((sum, a) => sum + a.count, 0);

  // Compute simple trend direction (comparing second half of dates vs first half)
  let trendText = 'Stable';
  let trendIcon = '➡️';
  let trendColor = '#6B7280';
  let trendBg = '#F3F4F6';

  if (activity.length >= 2) {
    const mid = Math.floor(activity.length / 2);
    const firstHalfSum = activity.slice(0, mid).reduce((s, a) => s + a.count, 0);
    const secondHalfSum = activity.slice(mid).reduce((s, a) => s + a.count, 0);

    if (secondHalfSum > firstHalfSum) {
      trendText = 'Increasing';
      trendIcon = '📈';
      trendColor = '#059669';
      trendBg = '#D1FAE5';
    } else if (secondHalfSum < firstHalfSum) {
      trendText = 'Decreasing';
      trendIcon = '📉';
      trendColor = '#DC2626';
      trendBg = '#FEE2E2';
    }
  }

  // Display top 7 recent activity points to fit cleanly on mobile screens
  const displayPoints = activity.slice(-7);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cardTitle}>Activity Trend</Text>
          <Text style={styles.subtitle}>{totalActivity} items created in recent period</Text>
        </View>

        <View style={[styles.trendBadge, { backgroundColor: trendBg }]}>
          <Text style={styles.trendIcon}>{trendIcon}</Text>
          <Text style={[styles.trendText, { color: trendColor }]}>{trendText}</Text>
        </View>
      </View>

      {/* Sparkline / Vertical Bars */}
      <View style={styles.chartContainer}>
        {displayPoints.map((point, idx) => {
          const heightPct = Math.max((point.count / maxCount) * 100, 15);
          const dateLabel = point.date.length >= 5 ? point.date.slice(5) : point.date; // MM-DD
          const barHeight = `${heightPct}%` as DimensionValue;

          return (
            <View key={`${point.date}-${idx}`} style={styles.barColumn}>
              <Text style={styles.barValue}>{point.count}</Text>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={['#818CF8', '#4F46E5']}
                  style={[styles.barFill, { height: barHeight }]}
                />
              </View>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 4px 10px rgba(24, 24, 27, 0.05))',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  trendIcon: {
    fontSize: 12,
  },
  trendText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: '#F4F4F5',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  dateLabel: {
    fontSize: 10,
    color: '#71717A',
    marginTop: 6,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
