import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography, Spacing } from '../../theme/typography';

interface SegmentedControlProps {
  authMode: 'login' | 'signup';
  onChangeMode: (mode: 'login' | 'signup') => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  authMode,
  onChangeMode,
}) => {
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const isLogin = authMode === 'login';

  // Shared value 0 = login, 1 = signup
  const slideProgress = useSharedValue(isLogin ? 0 : 1);

  React.useEffect(() => {
    slideProgress.value = withSpring(isLogin ? 0 : 1, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });
  }, [isLogin]);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const pillWidth = containerWidth ? (containerWidth - 8) / 2 : 0;

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: slideProgress.value * pillWidth,
        },
      ],
    };
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Sliding Active Pill with Dynamic Gradient */}
      {pillWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activePillContainer,
            { width: pillWidth },
            animatedPillStyle,
          ]}
        >
          {isLogin ? (
            <LinearGradient
              colors={['#8898DF', '#7889D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            />
          ) : (
            <LinearGradient
              colors={['#24CCA8', '#38DFC0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            />
          )}
        </Animated.View>
      )}

      {/* Login Tab Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeMode('login')}
        style={styles.tabButton}
        accessibilityRole="tab"
        accessibilityState={{ selected: isLogin }}
        accessibilityLabel="Log in tab"
      >
        <Text
          style={[
            styles.tabText,
            {
              color: isLogin ? '#FFFFFF' : '#6A6F82',
              fontWeight: isLogin ? '600' : '500',
            },
          ]}
        >
          Log in
        </Text>
      </TouchableOpacity>

      {/* Sign Up Tab Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChangeMode('signup')}
        style={styles.tabButton}
        accessibilityRole="tab"
        accessibilityState={{ selected: !isLogin }}
        accessibilityLabel="Sign up tab"
      >
        <Text
          style={[
            styles.tabText,
            {
              color: !isLogin ? '#FFFFFF' : '#6A6F82',
              fontWeight: !isLogin ? '600' : '500',
            },
          ]}
        >
          Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#EBECEF',
    borderRadius: Spacing.pillRadius,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
    marginBottom: 22,
  },
  activePillContainer: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: Spacing.pillRadius,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#364066',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0px 2px 8px rgba(36, 64, 102, 0.15)',
      },
    }),
  },
  pillGradient: {
    flex: 1,
    borderRadius: Spacing.pillRadius,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  tabText: {
    ...Typography.tabLabel,
  },
});
