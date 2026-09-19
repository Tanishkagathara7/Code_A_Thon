import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { appConfig } from '../../config/appConfig';
import Svg, { Path, Circle } from 'react-native-svg';

export const ProfileSettingsView: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Command Console?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              showToast('Signed out successfully', 'info');
              router.replace('/(auth)');
            } catch {
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const userRole = (user?.role || 'COORDINATOR').toUpperCase();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Profile Identity Hero Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name || 'Pulse Operator'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{userRole}</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{user?.email || 'operator@pulse.command'}</Text>
            <Text style={styles.meshStatus}>
              ● Node Connected • Dispatch Mesh Active
            </Text>
          </View>
        </View>

        <View style={styles.profileMetricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNum}>Active</Text>
            <Text style={styles.metricLabel}>Duty State</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNum}>99.9%</Text>
            <Text style={styles.metricLabel}>SLA Compliance</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNum}>{isOffline ? 'Offline' : 'Real-time'}</Text>
            <Text style={styles.metricLabel}>Sync Network</Text>
          </View>
        </View>
      </View>

      {/* 2. System Settings & Preferences */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SYSTEM PREFERENCES</Text>
      </View>

      <View style={styles.settingsGroup}>
        {/* Toggle Notifications */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Dispatch Alerts</Text>
            <Text style={styles.settingSubtitle}>Instant notification for high-priority incidents</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E6E9F0', true: '#EDE9FE' }}
            thumbColor={notificationsEnabled ? '#5B45F5' : '#FFFFFF'}
          />
        </View>

        {/* Offline Cache & Sync */}
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Offline Cache Sync</Text>
            <Text style={styles.settingSubtitle}>Store recent incident records for offline access</Text>
          </View>
          <Switch
            value={offlineSyncEnabled}
            onValueChange={setOfflineSyncEnabled}
            trackColor={{ false: '#E6E9F0', true: '#EDE9FE' }}
            thumbColor={offlineSyncEnabled ? '#5B45F5' : '#FFFFFF'}
          />
        </View>

        {/* Biometric Security */}
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Biometric Verification</Text>
            <Text style={styles.settingSubtitle}>Require fingerprint/FaceID before deleting records</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: '#E6E9F0', true: '#EDE9FE' }}
            thumbColor={biometricEnabled ? '#5B45F5' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* 3. Operational & Account Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>OPERATIONS & ACCOUNT</Text>
      </View>

      <View style={styles.settingsGroup}>
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push('/items')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Text style={{ fontSize: 14 }}>📋</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Incident Ledger</Text>
            <Text style={styles.settingSubtitle}>Browse all active and resolved records</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingDivider} />
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Text style={{ fontSize: 14 }}>🔔</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Alerts Center</Text>
            <Text style={styles.settingSubtitle}>Review dispatch updates and system logs</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingDivider} />
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => showToast(`Pulse Command Console v1.0.4 (${appConfig.appName})`, 'info')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Text style={{ fontSize: 14 }}>⚡</Text>
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>App & Engine Telemetry</Text>
            <Text style={styles.settingSubtitle}>Pulse Engine v1.0.4 • Dual-Platform Web/Mobile</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.signOutButtonText}>Sign Out of Console</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#5B45F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  roleBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#5B45F5',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  userEmail: {
    fontSize: 12,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 2,
  },
  meshStatus: {
    fontSize: 10.5,
    color: '#10B981',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginTop: 4,
  },
  profileMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F9',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  metricLabel: {
    fontSize: 10,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E6E9F0',
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#68728A',
    letterSpacing: 0.8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F3F9',
    marginHorizontal: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '600',
  },
  signOutButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  signOutButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
