import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  NavHomeIcon,
  NavShieldIcon,
  NavBenefitsIcon,
  NavBuyIcon,
  NavPlusIcon,
} from './NavIcons';

export type TabKey = 'home' | 'policies' | 'create' | 'benefits' | 'buy';

interface InteractiveNavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const InteractiveNavbar: React.FC<InteractiveNavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { width } = useWindowDimensions();
  const barWidth = width;
  const barHeight = 56;
  const centerCutoutRadius = 24;
  const centerX = barWidth / 2;

  // Curvature SVG path: tight, sleek curve with minimized top boundary distance to the icons
  const cutoutPath = `
    M 0 0
    L ${centerX - 42} 0
    C ${centerX - 28} 0, ${centerX - 26} ${centerCutoutRadius}, ${centerX} ${centerCutoutRadius}
    C ${centerX + 26} ${centerCutoutRadius}, ${centerX + 28} 0, ${centerX + 42} 0
    L ${barWidth} 0
    L ${barWidth} ${barHeight + 35}
    L 0 ${barHeight + 35}
    Z
  `;

  return (
    <View style={styles.outerContainer}>
      {/* Curved Nav Canvas Background */}
      <View style={[styles.svgBackgroundWrapper, { width: barWidth, height: barHeight + 35 }]}>
        <Svg width={barWidth} height={barHeight + 35} viewBox={`0 0 ${barWidth} ${barHeight + 35}`}>
          <Path
            d={cutoutPath}
            fill="#FFFFFF"
          />
        </Svg>
      </View>

      {/* Raised Floating Center Purple Plus Button */}
      <View style={[styles.centerButtonWrapper, { left: centerX - 25 }]}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onSelectTab('create')}
          style={styles.floatingCenterTouchable}
          accessibilityLabel="Create"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#8898DF', '#6D7FD5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.centerGradientCircle}
          >
            <NavPlusIcon size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tabs Row */}
      <View style={[styles.navItemsRow, { width: barWidth }]}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelectTab('home')}
          style={styles.navItem}
        >
          <NavHomeIcon
            size={25}
            color={activeTab === 'home' ? '#6D7FD5' : '#8E94A5'}
            focused={activeTab === 'home'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Home
          </Text>
          {activeTab === 'home' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 2: Policies */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelectTab('policies')}
          style={styles.navItem}
        >
          <NavShieldIcon
            size={25}
            color={activeTab === 'policies' ? '#6D7FD5' : '#8E94A5'}
            focused={activeTab === 'policies'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'policies' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Policies
          </Text>
          {activeTab === 'policies' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Center Blank Spacer for the floating circle */}
        <View style={styles.centerSpacer} />

        {/* Tab 3: Benefits */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelectTab('benefits')}
          style={styles.navItem}
        >
          <NavBenefitsIcon
            size={25}
            color={activeTab === 'benefits' ? '#6D7FD5' : '#8E94A5'}
            focused={activeTab === 'benefits'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'benefits' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Benefits
          </Text>
          {activeTab === 'benefits' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 4: Buy */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelectTab('buy')}
          style={styles.navItem}
        >
          <NavBuyIcon
            size={25}
            color={activeTab === 'buy' ? '#6D7FD5' : '#8E94A5'}
            focused={activeTab === 'buy'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'buy' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Buy
          </Text>
          {activeTab === 'buy' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 100,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#1E274A',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 12,
      },
      default: {
        filter: 'drop-shadow(0px -4px 14px rgba(30, 39, 74, 0.06))',
      },
    }),
  },
  svgBackgroundWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -20,
    width: 50,
    height: 50,
    zIndex: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCenterTouchable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#6D7FD5',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.42,
        shadowRadius: 8,
      },
      android: {
        elevation: 7,
      },
      default: {
        filter: 'drop-shadow(0px 5px 12px rgba(109, 127, 213, 0.42))',
      },
    }),
  },
  centerGradientCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  navItemsRow: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  centerSpacer: {
    width: 52,
  },
  navLabel: {
    fontSize: 10.5,
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  navLabelActive: {
    color: '#6D7FD5',
    fontWeight: '700',
  },
  navLabelInactive: {
    color: '#8E94A5',
    fontWeight: '500',
  },
  activeIndicator: {
    width: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#6D7FD5',
    marginTop: 2,
  },
});
