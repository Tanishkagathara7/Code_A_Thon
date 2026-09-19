import React from 'react';
import { StyleSheet, View, Text, Platform, DimensionValue } from 'react-native';
import { CategoryMetric } from '../../types/analytics';

export interface CategoryDistributionChartProps {
  categories: CategoryMetric[];
  totalCount?: number;
}

const CATEGORY_COLORS: string[] = [
  '#5B45F5', // Pulse Brand Purple
  '#38BDF8', // Cyan Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  categories,
  totalCount,
}) => {
  const sum = totalCount || categories.reduce((acc, curr) => acc + curr.count, 0);

  if (categories.length === 0 || sum === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No incident category data yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cardTitle}>State-wise & Slabs Breakdown</Text>
          <Text style={styles.subtitle}>Distribution of invoices by place of supply & category</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{sum} Bills</Text>
        </View>
      </View>

      {/* Progress stack bar visual */}
      <View style={styles.stackBarContainer}>
        {categories.map((cat, idx) => {
          const pct = Math.max((cat.count / sum) * 100, 3);
          const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const segmentWidth = `${pct}%` as DimensionValue;
          return (
            <View
              key={`${cat.category}-${idx}`}
              style={[
                styles.stackSegment,
                { width: segmentWidth, backgroundColor: color },
              ]}
            />
          );
        })}
      </View>

      {/* Breakdown detail rows */}
      <View style={styles.listContainer}>
        {categories.map((cat, idx) => {
          const percentage = ((cat.count / sum) * 100).toFixed(0);
          const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const barWidth = `${percentage}%` as DimensionValue;

          return (
            <View key={`${cat.category}-${idx}`} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.category}
                </Text>
              </View>

              <View style={styles.statInfo}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { width: barWidth, backgroundColor: color },
                    ]}
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
    alignItems: 'flex-start',
    marginBottom: 14,
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
  totalBadge: {
    backgroundColor: '#F8F9FC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  totalBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#5B45F5',
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
  stackBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F3F9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
  },
  stackSegment: {
    height: '100%',
  },
  listContainer: {
    gap: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barBackground: {
    width: 60,
    height: 5,
    backgroundColor: '#F1F3F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  countText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    minWidth: 18,
    textAlign: 'right',
  },
  percentageText: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
    minWidth: 28,
    textAlign: 'right',
  },
});
