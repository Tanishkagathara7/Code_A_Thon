import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  withRepeat,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

interface InteractiveBackgroundProps {
  scrollX: SharedValue<number>;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  isTouching: SharedValue<boolean>;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  scrollX,
  touchX,
  touchY,
  isTouching,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Pulse / floating ambient animation values
  const floatAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    pulseAnim.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  // Primary Base Canvas Style (Morphs soft tint continuously across 3 screens)
  const baseCanvasStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      [
        0,
        SCREEN_WIDTH,
        SCREEN_WIDTH * 2,
      ],
      [
        '#FBF9F5', // Screen 1: Warm Ivory
        '#F7F3EE', // Screen 2: Soft Pearl Sand
        '#F9F7F4', // Screen 3: Light Warm Champagne
      ]
    );

    return {
      backgroundColor,
    };
  });

  // Blob 1: Large Warm Rose / Peach Light Shape (Top-Right / Dynamic)
  const blob1Style = useAnimatedStyle(() => {
    const scrollTranslateX = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [0, -SCREEN_WIDTH * 0.25, -SCREEN_WIDTH * 0.35],
      Extrapolation.CLAMP
    );

    const scrollScale = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [1, 1.15, 1.05],
      Extrapolation.CLAMP
    );

    const floatOffset = interpolate(floatAnim.value, [0, 1], [-20, 20]);
    const magneticX = isTouching.value ? (touchX.value - SCREEN_WIDTH / 2) * 0.08 : 0;
    const magneticY = isTouching.value ? (touchY.value - SCREEN_HEIGHT / 3) * 0.08 : 0;

    return {
      transform: [
        { translateX: scrollTranslateX + floatOffset + magneticX },
        { translateY: floatOffset * 0.7 + magneticY },
        { scale: scrollScale + pulseAnim.value * 0.05 },
      ],
      opacity: interpolate(
        scrollX.value,
        [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
        [0.65, 0.75, 0.8]
      ),
    };
  });

  // Blob 2: Cool Lavender / Silver Depth Shape (Bottom-Left / Dynamic)
  const blob2Style = useAnimatedStyle(() => {
    const scrollTranslateX = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [0, SCREEN_WIDTH * 0.3, SCREEN_WIDTH * 0.2],
      Extrapolation.CLAMP
    );

    const scrollTranslateY = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [0, -40, -20],
      Extrapolation.CLAMP
    );

    const floatOffset = interpolate(floatAnim.value, [0, 1], [15, -15]);
    const magneticX = isTouching.value ? (touchX.value - SCREEN_WIDTH / 2) * 0.06 : 0;
    const magneticY = isTouching.value ? (touchY.value - SCREEN_HEIGHT / 2) * 0.06 : 0;

    return {
      transform: [
        { translateX: scrollTranslateX - floatOffset + magneticX },
        { translateY: scrollTranslateY + floatOffset + magneticY },
        { scale: 1 + pulseAnim.value * 0.08 },
      ],
      opacity: interpolate(
        scrollX.value,
        [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
        [0.5, 0.65, 0.7]
      ),
    };
  });

  // Blob 3: Central Soft Glow (Follows Touch Magnetically)
  const touchGlowStyle = useAnimatedStyle(() => {
    const targetX = touchX.value - 120;
    const targetY = touchY.value - 120;

    return {
      transform: [
        { translateX: targetX },
        { translateY: targetY },
        { scale: isTouching.value ? 1.4 : 0.8 },
      ],
      opacity: isTouching.value ? 0.35 : 0.15,
    };
  });

  // Subtle Light Refraction Grid Lines
  const gridStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [0.05, 0.03, 0.05]
    );

    return { opacity };
  });

  return (
    <Animated.View style={[styles.container, baseCanvasStyle]}>
      {/* Background Depth Layer 1: Ambient Light Blob 1 (Warm Peach/Gold Glow) */}
      <Animated.View
        style={[
          styles.blob,
          styles.blob1,
          {
            width: SCREEN_WIDTH * 1.2,
            height: SCREEN_WIDTH * 1.2,
            borderRadius: SCREEN_WIDTH * 0.6,
            top: -SCREEN_WIDTH * 0.2,
            right: -SCREEN_WIDTH * 0.2,
          },
          blob1Style,
        ]}
      />

      {/* Background Depth Layer 2: Soft Lavender Silver Blob */}
      <Animated.View
        style={[
          styles.blob,
          styles.blob2,
          {
            width: SCREEN_WIDTH * 1.1,
            height: SCREEN_WIDTH * 1.1,
            borderRadius: SCREEN_WIDTH * 0.55,
            bottom: -SCREEN_WIDTH * 0.1,
            left: -SCREEN_WIDTH * 0.2,
          },
          blob2Style,
        ]}
      />

      {/* Touch Magnetic Glow Node */}
      <Animated.View style={[styles.touchGlow, touchGlowStyle]} />

      {/* Subtle Fine Grid Texture Overlay */}
      <Animated.View style={[styles.gridOverlay, gridStyle]}>
        <View style={styles.verticalLine1} />
        <View style={styles.verticalLine2} />
        <View style={styles.horizontalLine1} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
  },
  blob1: {
    backgroundColor: 'rgba(244, 218, 204, 0.65)', // Warm Rose Gold / Soft Peach
  },
  blob2: {
    backgroundColor: 'rgba(215, 220, 238, 0.7)', // Cool Pearl Lavender / Soft Ice
  },
  touchGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 235, 210, 0.45)',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  verticalLine1: {
    position: 'absolute',
    left: '25%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  verticalLine2: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  horizontalLine1: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});
