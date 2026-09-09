import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Typography, Spacing } from '../../theme/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const brightness = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withTiming(0.975, {
      duration: 140,
      easing: Easing.out(Easing.quad),
    });
    brightness.value = withTiming(0.85, { duration: 140 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });
    brightness.value = withTiming(1, { duration: 180 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: brightness.value,
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.button, (disabled || loading) && styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={Typography.buttonPrimary}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: Spacing.pillRadius,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.22)',
      },
    }),
  },
  button: {
    height: 52,
    backgroundColor: '#0F1115',
    borderRadius: Spacing.pillRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.6,
  },
});
