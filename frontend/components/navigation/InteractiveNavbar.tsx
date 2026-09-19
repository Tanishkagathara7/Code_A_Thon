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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavHomeIcon,
  NavShieldIcon,
  NavCopilotIcon,
  NavProfileIcon,
  NavPlusIcon,
} from './NavIcons';
import { appConfig } from '../../config/appConfig';

export type TabKey = 'home' | 'items' | 'create' | 'ai' | 'profile';

interface InteractiveNavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const InteractiveNavbar: React.FC<InteractiveNavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const barWidth = width;

  // Bottom safe area offset handling (gesture bar / physical home bar)
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);
  const barHeight = 62;
  const totalHeight = barHeight + bottomInset;

  // Center button & cutout geometry (tighter, closer to buttons)
  const centerCutoutRadius = 18;
  const centerX = barWidth / 2;

  // Precise, compact curvature hugging closely to the center FAB
  const cutoutPath = `
    M 0 0
    L ${centerX - 46} 0
    C ${centerX - 30} 0, ${centerX - 28} ${centerCutoutRadius}, ${centerX} ${centerCutoutRadius}
    C ${centerX + 28} ${centerCutoutRadius}, ${centerX + 30} 0, ${centerX + 46} 0
    L ${barWidth} 0
    L ${barWidth} ${totalHeight}
    L 0 ${totalHeight}
    Z
  `;

  return (
    <View style={[styles.outerContainer, { height: totalHeight }]}>
      {/* Curved Nav Canvas Background */}
      <View style={[styles.svgBackgroundWrapper, { width: barWidth, height: totalHeight }]}>
        <Svg width={barWidth} height={totalHeight} viewBox={`0 0 ${barWidth} ${totalHeight}`}>
          <Path
            d={cutoutPath}
            fill="#FFFFFF"
            stroke="#E6E9F0"
            strokeWidth={1}
          />
        </Svg>
      </View>

      {/* Raised Floating Center Action Button */}
      <View style={[styles.centerButtonWrapper, { left: centerX - 27 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectTab('create')}
          style={styles.floatingCenterTouchable}
          accessibilityLabel="Log Incident"
          accessibilityRole="button"
        >
          <View style={styles.centerCircle}>
            <NavPlusIcon size={26} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs Row */}
      <View
        style={[
          styles.navItemsRow,
          {
            width: barWidth,
            height: barHeight,
            paddingBottom: Platform.OS === 'ios' ? 4 : 2,
          },
        ]}
      >
        {/* Tab 1: Home / Command */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectTab('home')}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'home' }}
          accessibilityLabel="Command Console"
        >
          <NavHomeIcon
            size={24}
            color={activeTab === 'home' ? '#5B45F5' : '#68728A'}
            focused={activeTab === 'home'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Command
          </Text>
          {activeTab === 'home' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 2: Incidents / Items */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectTab('items')}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'items' }}
          accessibilityLabel={appConfig.entityPluralName || 'Incidents'}
        >
          <NavShieldIcon
            size={24}
            color={activeTab === 'items' ? '#5B45F5' : '#68728A'}
            focused={activeTab === 'items'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'items' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            {appConfig.entityPluralName || 'Incidents'}
          </Text>
          {activeTab === 'items' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Center Spacer for Floating Button */}
        <View style={styles.centerSpacer} />

        {/* Tab 3: AI Copilot */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectTab('ai')}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'ai' }}
          accessibilityLabel="AI Copilot"
        >
          <NavCopilotIcon
            size={24}
            color={activeTab === 'ai' ? '#5B45F5' : '#68728A'}
            focused={activeTab === 'ai'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'ai' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Copilot
          </Text>
          {activeTab === 'ai' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        {/* Tab 4: Profile & Settings */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelectTab('profile')}
          style={styles.navItem}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'profile' }}
          accessibilityLabel="Profile and Settings"
        >
          <NavProfileIcon
            size={24}
            color={activeTab === 'profile' ? '#5B45F5' : '#68728A'}
            focused={activeTab === 'profile'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'profile' ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Profile
          </Text>
          {activeTab === 'profile' && <View style={styles.activeIndicator} />}
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
    zIndex: 100,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#101226',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 14,
      },
      default: {
        filter: 'drop-shadow(0px -4px 12px rgba(16, 18, 38, 0.08))',
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
    top: -16,
    width: 54,
    height: 54,
    zIndex: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCenterTouchable: {
    width: 54,
    height: 54,
    borderRadius: 27,
    ...Platform.select({
      ios: {
        shadowColor: '#5B45F5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        filter: 'drop-shadow(0px 4px 10px rgba(91, 69, 245, 0.35))',
      },
    }),
  },
  centerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#5B45F5',
  },
  navItemsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    zIndex: 105,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    minWidth: 48,
    paddingVertical: 4,
    position: 'relative',
  },
  centerSpacer: {
    width: 58,
  },
  navLabel: {
    fontSize: 11.5,
    marginTop: 3,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: -0.1,
  },
  navLabelActive: {
    color: '#5B45F5',
    fontWeight: '800',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  navLabelInactive: {
    color: '#68728A',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#5B45F5',
  },
});
