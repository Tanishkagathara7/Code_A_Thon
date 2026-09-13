import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  gradientColors?: [string, string];
  accentColor?: string;
  icon?: string;
  index?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  gradientColors,
  accentColor = '#4F46E5',
  icon,
  index = 0,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).duration(250)}
      style={styles.cardContainer}
    >
      {gradientColors ? (
        <LinearGradient colors={gradientColors} style={styles.gradientCard}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: '#FFFFFF' }]}>{title}</Text>
            {badge && (
              <View style={styles.lightBadge}>
                <Text style={styles.lightBadgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <View style={styles.valueRow}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.value, { color: '#FFFFFF' }]}>{value}</Text>
          </View>
          {subtitle && <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.85)' }]}>{subtitle}</Text>}
        </LinearGradient>
      ) : (
        <View style={[styles.solidCard, { borderLeftColor: accentColor }]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            {badge && (
              <View style={[styles.badge, { backgroundColor: `${accentColor}15` }]}>
                <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
              </View>
            )}
          </View>
          <View style={styles.valueRow}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.value, { color: '#09090B' }]}>{value}</Text>
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 4px 8px rgba(24, 24, 27, 0.05))',
      },
    }),
  },
  gradientCard: {
    padding: 16,
    borderRadius: 16,
  },
  solidCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderLeftWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#71717A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  lightBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lightBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#A1A1AA',
    marginTop: 4,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
});
