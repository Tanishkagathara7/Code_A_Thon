import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';

interface ServiceItem {
  name: string;
  status: 'Healthy' | 'Degraded';
  uptime: string;
  latency: string;
  iconColor: string;
}

const SERVICES: ServiceItem[] = [
  {
    name: 'GST Portal Gateway',
    status: 'Healthy',
    uptime: '99.99%',
    latency: '18ms',
    iconColor: '#10B981',
  },
  {
    name: 'Tax Calculation Engine',
    status: 'Healthy',
    uptime: '100.0%',
    latency: '4ms',
    iconColor: '#10B981',
  },
  {
    name: 'A4 / Thermal Print Queue',
    status: 'Healthy',
    uptime: '99.95%',
    latency: '12ms',
    iconColor: '#10B981',
  },
  {
    name: 'WhatsApp & Khata Sync',
    status: 'Healthy',
    uptime: '99.98%',
    latency: '28ms',
    iconColor: '#10B981',
  },
];

export const MobileServiceHealth: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.healthIcon}>
            <Text style={{ fontSize: 13 }}>₹</Text>
          </View>
          <View>
            <Text style={styles.title}>GST Engine & Portal Health</Text>
            <Text style={styles.subtitle}>Statutory tax gateways and POS hardware link</Text>
          </View>
        </View>
      </View>

      {/* 2x2 Services Grid */}
      <View style={styles.grid}>
        {SERVICES.map((svc) => {
          const isDegraded = svc.status === 'Degraded';

          return (
            <View key={svc.name} style={styles.serviceBox}>
              <View style={styles.serviceTopRow}>
                <View style={styles.serviceNameGroup}>
                  <View style={[styles.statusDot, { backgroundColor: svc.iconColor }]} />
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {svc.name}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isDegraded ? '#FEF3C7' : '#DCFCE7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isDegraded ? '#D97706' : '#16B981' },
                    ]}
                  >
                    {svc.status}
                  </Text>
                </View>
              </View>

              <View style={styles.serviceBottomRow}>
                <Text style={styles.uptimeText}>{svc.uptime} uptime</Text>
                <Text style={styles.latencyText}>{svc.latency}</Text>
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
    padding: 16,
    marginVertical: 8,
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
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  healthIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceBox: {
    flex: 1,
    minWidth: '46%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  serviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  serviceNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginRight: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  statusPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  serviceBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  uptimeText: {
    fontSize: 10,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  latencyText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'monospace',
  },
});
