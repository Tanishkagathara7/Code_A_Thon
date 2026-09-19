import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { HackathonItem } from '../../types/domain';

interface DashboardRecentIncidentsProps {
  items: HackathonItem[];
  isLoading?: boolean;
}

const getSeverityDetails = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return { label: 'Critical', color: '#EF4444', dotColor: '#EF4444' };
    case 'high':
      return { label: 'Major', color: '#D97706', dotColor: '#F59E0B' };
    default:
      return { label: 'Minor', color: '#16B981', dotColor: '#10B981' };
  }
};

const getStatusDetails = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { label: 'Resolved', bg: '#DCFCE7', text: '#16B981', dot: '#16B981' };
    case 'in_progress':
      return { label: 'In-Flight', bg: '#EDE9FE', text: '#5B45F5', dot: '#5B45F5' };
    case 'pending':
    default:
      return { label: 'Investigating', bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' };
  }
};

export const DashboardRecentIncidents: React.FC<DashboardRecentIncidentsProps> = ({
  items = [],
  isLoading = false,
}) => {
  const router = useRouter();

  const displayItems = items.slice(0, 5);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.clockIcon}>
            <Text style={{ fontSize: 13 }}>🕒</Text>
          </View>
          <View>
            <Text style={styles.title}>Recent Incident Activity</Text>
            <Text style={styles.subtitle}>Latest records across all devices</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/items')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.viewAllText}>View All ›</Text>
        </TouchableOpacity>
      </View>

      {/* Items list */}
      {displayItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isLoading
              ? 'Loading recent incidents...'
              : 'No incidents logged yet. Tap "Log Incident" to start.'}
          </Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {displayItems.map((item, idx) => {
            const severity = getSeverityDetails(item.priority);
            const status = getStatusDetails(item.status);
            const idDisplay = item.id ? `INC-${item.id.slice(-4).toUpperCase()}` : `INC-${1024 - idx}`;

            return (
              <TouchableOpacity
                key={item.id || idx}
                style={styles.itemRow}
                activeOpacity={0.7}
                onPress={() => item.id && router.push(`/items/${item.id}`)}
              >
                {/* Left side: dot + id + title */}
                <View style={styles.itemLeft}>
                  <View style={[styles.priorityDot, { backgroundColor: severity.dotColor }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.idAndCategoryRow}>
                      <Text style={styles.itemIdText}>{idDisplay}</Text>
                      {item.category ? (
                        <Text style={styles.categoryPill}>{item.category}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </View>

                {/* Right side: status badge */}
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
                  <Text style={[styles.statusText, { color: status.text }]}>
                    {status.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clockIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B45F5',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  itemsList: {
    paddingTop: 8,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F8F9FC',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  idAndCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  itemIdText: {
    fontSize: 10,
    color: '#68728A',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  categoryPill: {
    fontSize: 9.5,
    color: '#68728A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
