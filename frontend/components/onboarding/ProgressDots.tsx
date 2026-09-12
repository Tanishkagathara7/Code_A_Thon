import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';

interface ProgressDotsProps {
  total: number;
  scrollX: SharedValue<number>;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, scrollX }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const dotAnimatedStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 28, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.35, 1, 0.35],
            Extrapolation.CLAMP
          );

          return {
            width: dotWidth,
            opacity,
          };
        });

        const activeGlowStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0, 1, 0],
            Extrapolation.CLAMP
          );

          return {
            opacity,
          };
        });

        return (
          <View key={`dot-${index}`} style={styles.dotWrapper}>
            <Animated.View style={[styles.dot, dotAnimatedStyle]}>
              <Animated.View style={[styles.dotActiveGradient, activeGlowStyle]} />
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  dotWrapper: {
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  dotActiveGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#3EEED4',
    borderRadius: 4,
  },
});
