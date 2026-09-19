import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';

export type MetricVariant = 'total' | 'active' | 'resolved' | 'velocity';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  variant: MetricVariant;
  trend?: string;
  index?: number;
}

const VARIANT_CONFIG: Record<
  MetricVariant,
  {
    iconBg: string;
    iconColor: string;
    trendBg: string;
    trendText: string;
  }
> = {
  total: {
    iconBg: '#F8F9FC',
    iconColor: '#101226',
    trendBg: '#DCFCE7',
    trendText: '#16B981',
  },
  active: {
    iconBg: '#EDE9FE',
    iconColor: '#5B45F5',
    trendBg: '#FEE2E2',
    trendText: '#EF4444',
  },
  resolved: {
    iconBg: '#DCFCE7',
    iconColor: '#16B981',
    trendBg: '#DCFCE7',
    trendText: '#16B981',
  },
  velocity: {
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
    trendBg: '#DCFCE7',
    trendText: '#16B981',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  variant,
  trend,
  index = 0,
}) => {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.total;

  // Render SVG Icon depending on variant
  const renderIcon = () => {
    switch (variant) {
      case 'total':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M2 17L12 22L22 17"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M2 12L12 17L22 12"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'active':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke={config.iconColor}
              strokeWidth="2"
            />
            <Path
              d="M12 6V12L16 14"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );
      case 'resolved':
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M22 4L12 14.01L9 11.01"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'velocity':
      default:
        return (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 6L13.5 15.5L8.5 10.5L1 18"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17 6H23V12"
              stroke={config.iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
    }
  };

  // Render mini sparkline / bar visualization matching web reference
  const renderSparkline = () => {
    if (variant === 'total') {
      return (
        <View style={styles.miniBarGroup}>
          <View style={[styles.miniBar, { height: 7 }]} />
          <View style={[styles.miniBar, { height: 13 }]} />
          <View style={[styles.miniBar, { height: 10 }]} />
          <View style={[styles.miniBar, { height: 17 }]} />
          <View style={[styles.miniBar, { height: 22 }]} />
        </View>
      );
    }

    if (variant === 'active') {
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Path
            d="M2 20 L16 16 L30 22 L44 10 L62 14"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }

    if (variant === 'resolved') {
      return (
        <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
          <Path
            d="M2 18 L16 12 L28 16 L42 8 L62 12"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }

    return (
      <Svg width={54} height={24} viewBox="0 0 64 28" fill="none">
        <Path
          d="M2 22 L14 18 L26 20 L42 12 L62 8"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).duration(250)}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        {/* Top Header: Icon and Label */}
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: config.iconBg }]}>
            {renderIcon()}
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>

        {/* Value & Trend */}
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {trend ? (
            <View style={[styles.trendBadge, { backgroundColor: config.trendBg }]}>
              <Text style={[styles.trendText, { color: config.trendText }]}>
                {trend}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Bottom Subtext & Mini Sparkline */}
        <View style={styles.footerRow}>
          <Text style={styles.subtext} numberOfLines={2}>
            {subtext}
          </Text>
          <View style={styles.sparklineContainer}>{renderSparkline()}</View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minWidth: 145,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    overflow: 'hidden',
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
  card: {
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: '900',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.5,
  },
  trendBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
    paddingTop: 4,
  },
  subtext: {
    fontSize: 11,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 15,
    flex: 1,
  },
  sparklineContainer: {
    height: 24,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  miniBarGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 22,
  },
  miniBar: {
    width: 4,
    backgroundColor: '#E6E9F0',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});
