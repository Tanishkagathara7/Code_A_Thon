import React from 'react';
import { StyleSheet, View, Text, Platform, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryMetric } from '../../types/analytics';

export interface CategoryDistributionChartProps {
  categories: CategoryMetric[];
  totalCount?: number;
}

const CATEGORY_COLORS: [string, string][] = [
  ['#6366F1', '#4F46E5'], // Indigo
  ['#3B82F6', '#2563EB'], // Blue
  ['#10B981', '#059669'], // Emerald
  ['#F59E0B', '#D97706'], // Amber
  ['#EC4899', '#DB2777'], // Pink
  ['#8B5CF6', '#7C3AED'], // Purple
  ['#06B6D4', '#0891B2'], // Cyan
];

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  categories,
  totalCount,
}) => {
  const sum = totalCount || categories.reduce((acc, curr) => acc + curr.count, 0);

  if (categories.length === 0 || sum === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Category Distribution</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No category distribution data available yet.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Category Distribution</Text>
        <Text style={styles.totalBadge}>{sum} Total Items</Text>
      </View>

      {/* Progress stack bar visual */}
      <View style={styles.stackBarContainer}>
        {categories.map((cat, idx) => {
          const pct = Math.max((cat.count / sum) * 100, 2);
          const colors = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const segmentWidth = `${pct}%` as DimensionValue;
          return (
            <LinearGradient
              key={`${cat.category}-${idx}`}
              colors={colors}
              style={[styles.stackSegment, { width: segmentWidth }]}
            />
          );
        })}
      </View>

      {/* Breakdown detail rows */}
      <View style={styles.listContainer}>
        {categories.map((cat, idx) => {
          const percentage = ((cat.count / sum) * 100).toFixed(1);
          const colors = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const barWidth = `${percentage}%` as DimensionValue;

          return (
            <View key={`${cat.category}-${idx}`} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.dot, { backgroundColor: colors[0] }]} />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.category}
                </Text>
              </View>

              <View style={styles.statInfo}>
                <View style={styles.barBackground}>
                  <LinearGradient
                    colors={colors}
                    style={[styles.barFill, { width: barWidth }]}
                  />
                </View>
                <Text style={styles.countText}>{cat.count}</Text>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  totalBadge: {
    fontSize: 11.5,
    color: '#6366F1',
    fontWeight: '600',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  stackBarContainer: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 18,
  },
  stackSegment: {
    height: '100%',
  },
  listContainer: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 13,
    color: '#27272A',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#F4F4F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  countText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#09090B',
    width: 24,
    textAlign: 'right',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  percentageText: {
    fontSize: 11.5,
    color: '#71717A',
    width: 44,
    textAlign: 'right',
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
