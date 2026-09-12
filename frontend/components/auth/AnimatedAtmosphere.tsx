import React, { useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedAtmosphereProps {
  authMode: 'login' | 'signup';
}

export const AnimatedAtmosphere: React.FC<AnimatedAtmosphereProps> = ({ authMode }) => {
  const { width, height } = useWindowDimensions();

  // Mode transition progress: 0 = login, 1 = signup
  const modeProgress = useSharedValue(authMode === 'login' ? 0 : 1);

  // Parallax shared values
  const pointerX = useSharedValue(0);
  const pointerY = useSharedValue(0);

  // Floating ambient orb values
  const orb1X = useSharedValue(0);
  const orb1Y = useSharedValue(0);

  const orb2X = useSharedValue(0);
  const orb2Y = useSharedValue(0);

  useEffect(() => {
    modeProgress.value = withTiming(authMode === 'login' ? 0 : 1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [authMode]);

  useEffect(() => {
    orb1X.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 7000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-16, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-24, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(18, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-22, { duration: 8500, easing: Easing.inOut(Easing.quad) }),
        withTiming(18, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(-22, { duration: 8500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  // Web mouse move parallax
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 20;
        const normY = (e.clientY / window.innerHeight - 0.5) * 20;
        pointerX.value = withSpring(normX, { damping: 15, stiffness: 90 });
        pointerY.value = withSpring(normY, { damping: 15, stiffness: 90 });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const animatedOrb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1X.value + pointerX.value },
      { translateY: orb1Y.value + pointerY.value },
    ],
  }));

  const animatedOrb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2X.value - pointerX.value * 0.7 },
      { translateY: orb2Y.value - pointerY.value * 0.7 },
    ],
  }));

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Light Warm Ivory Base Canvas */}
      <View style={styles.baseCanvas} />

      {/* Top Right Atmospheric Pastel Periwinkle Lavender Shape */}
      <Animated.View
        style={[
          styles.glowOrb,
          {
            width: width * 1.4,
            height: width * 1.4,
            top: -width * 0.35,
            right: -width * 0.3,
          },
          animatedOrb1Style,
        ]}
      >
        <LinearGradient
          colors={['rgba(224, 231, 255, 0.85)', 'rgba(238, 242, 255, 0.4)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.2, y: 1 }}
        />
      </Animated.View>

      {/* Bottom Left Atmospheric Pastel Lavender Shape */}
      <Animated.View
        style={[
          styles.glowOrb,
          {
            width: width * 1.3,
            height: width * 1.3,
            bottom: -width * 0.2,
            left: -width * 0.35,
          },
          animatedOrb2Style,
        ]}
      >
        <LinearGradient
          colors={['rgba(224, 231, 255, 0.75)', 'rgba(243, 232, 255, 0.45)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.3, y: 0.8 }}
          end={{ x: 1, y: 0.2 }}
        />
      </Animated.View>

      {/* Top Right Cursive Script Watermark: Better Ideas Everyday */}
      <View style={styles.topRightScriptWrapper}>
        <Text style={styles.scriptText}>Better</Text>
        <Text style={[styles.scriptText, styles.scriptTextSub]}>Ideas</Text>
        <Text style={[styles.scriptText, styles.scriptTextSub2]}>Everyday</Text>
        <View style={styles.scriptUnderline} />
      </View>

      {/* Bottom Left Cursive Script Watermark: Good Ideas Belong Here */}
      <View style={styles.bottomLeftScriptWrapper}>
        <Text style={styles.scriptText}>Good</Text>
        <Text style={[styles.scriptText, styles.scriptTextSub]}>Ideas</Text>
        <Text style={[styles.scriptText, styles.scriptTextSub2]}>Belong Here</Text>
        <View style={styles.scriptUnderline} />
      </View>

      {/* Bottom Right Soft Plant / Leaf Shadow Silhouette */}
      <View style={styles.bottomRightPlantShadow} />
    </View>
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
  baseCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF9F6', // Warm off-white / light ivory
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  topRightScriptWrapper: {
    position: 'absolute',
    top: 54,
    right: 24,
    alignItems: 'flex-end',
    opacity: 0.55,
  },
  bottomLeftScriptWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    alignItems: 'flex-start',
    opacity: 0.45,
  },
  scriptText: {
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#818CF8',
    letterSpacing: -0.5,
    lineHeight: 18,
  },
  scriptTextSub: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 6,
  },
  scriptTextSub2: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4F46E5',
  },
  scriptUnderline: {
    width: 32,
    height: 1.5,
    backgroundColor: '#818CF8',
    marginTop: 4,
    borderRadius: 1,
  },
  bottomRightPlantShadow: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
});
