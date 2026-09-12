import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface SegmentedControlProps {
  authMode: 'login' | 'signup';
  onChangeMode: (mode: 'login' | 'signup') => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  authMode,
  onChangeMode,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  // Card width inside sheet padding
  const containerWidth = Math.min(SCREEN_WIDTH - 48, 380);
  const trackPadding = 4;
  const tabWidth = (containerWidth - trackPadding * 2) / 2;

  const activeIndex = authMode === 'login' ? 0 : 1;
  const translateX = useSharedValue(activeIndex * tabWidth);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 22,
      stiffness: 260,
      mass: 0.8,
    });
  }, [activeIndex, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  return (
    <View style={styles.trackContainer}>
      {/* Animated Periwinkle Pill */}
      <Animated.View style={[styles.activePill, animatedIndicatorStyle]} />

      {/* Log In Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeMode('login')}
        style={styles.tabButton}
        accessibilityRole="button"
        accessibilityLabel="Switch to Log in"
      >
        <Text
          style={[
            styles.tabText,
            authMode === 'login' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Log in
        </Text>
      </TouchableOpacity>

      {/* Sign Up Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeMode('signup')}
        style={styles.tabButton}
        accessibilityRole="button"
        accessibilityLabel="Switch to Sign up"
      >
        <Text
          style={[
            styles.tabText,
            authMode === 'signup' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    width: '100%',
  },
  activePill: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 20,
    backgroundColor: '#818CF8', // Sophisticated periwinkle
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tabText: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveTabText: {
    color: '#64748B',
    fontWeight: '600',
  },
});
