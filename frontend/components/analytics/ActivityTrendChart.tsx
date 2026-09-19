import React from 'react';
import { StyleSheet, View, Text, Platform, DimensionValue } from 'react-native';
import { ActivityMetric } from '../../types/analytics';

export interface ActivityTrendChartProps {
  activity: ActivityMetric[];
}

export const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({ activity }) => {
  if (!activity || activity.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Incident Activity Trend</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent activity logged yet.</Text>
        </View>
      </View>
    );
  }

  const maxCount = Math.max(...activity.map((a) => a.count), 1);
  const totalActivity = activity.reduce((sum, a) => sum + a.count, 0);

  // Compute trend direction
  let trendText = 'Stable';
  let trendColor = '#68728A';
  let trendBg = '#F8F9FC';

  if (activity.length >= 2) {
    const mid = Math.floor(activity.length / 2);
    const firstHalfSum = activity.slice(0, mid).reduce((s, a) => s + a.count, 0);
    const secondHalfSum = activity.slice(mid).reduce((s, a) => s + a.count, 0);

    if (secondHalfSum > firstHalfSum) {
      trendText = '↑ Increasing';
      trendColor = '#16B981';
      trendBg = '#DCFCE7';
    } else if (secondHalfSum < firstHalfSum) {
      trendText = '↓ Decreasing';
      trendColor = '#EF4444';
      trendBg = '#FEE2E2';
    }
  }

  const displayPoints = activity.slice(-7);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cardTitle}>Incident Activity Trend</Text>
          <Text style={styles.subtitle}>{totalActivity} items in active period</Text>
        </View>

        <View style={[styles.trendBadge, { backgroundColor: trendBg }]}>
          <Text style={[styles.trendText, { color: trendColor }]}>{trendText}</Text>
        </View>
      </View>

      {/* Sparkline Columns */}
      <View style={styles.chartContainer}>
        {displayPoints.map((point, idx) => {
          const heightPct = Math.max((point.count / maxCount) * 100, 15);
          const dateLabel = point.date.length >= 5 ? point.date.slice(5) : point.date;
          const barHeight = `${heightPct}%` as DimensionValue;

          return (
            <View key={`${point.date}-${idx}`} style={styles.barColumn}>
              <Text style={styles.barValue}>{point.count}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: barHeight }]} />
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
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    ...Platform.select({
      ios: {
        shadowColor: '#101226',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 2px 6px rgba(16, 18, 38, 0.04))',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 2,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 10,
    color: '#68728A',
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    flex: 1,
    backgroundColor: '#F1F3F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#5B45F5',
    borderRadius: 7,
  },
  dateLabel: {
    fontSize: 10,
    color: '#68728A',
    marginTop: 6,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
