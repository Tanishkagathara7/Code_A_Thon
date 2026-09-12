import React, { useEffect } from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export const OnboardingVisual5: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 340);

  // Cinematic Portal animations
  const portalScale = useSharedValue(1);
  const portalRotate = useSharedValue('0deg');
  const innerPulse = useSharedValue(0.7);

  useEffect(() => {
    portalScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.92, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    portalRotate.value = withRepeat(
      withTiming('360deg', { duration: 18000, easing: Easing.linear }),
      -1,
      false
    );

    innerPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.5, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: portalScale.value }],
  }));

  const animatedRotate = useAnimatedStyle(() => ({
    transform: [{ rotate: portalRotate.value }],
  }));

  const animatedInner = useAnimatedStyle(() => ({
    opacity: innerPulse.value,
  }));

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Intense Background Portal Flare */}
      <Animated.View style={[styles.ambientFlare, animatedScale]}>
        <LinearGradient
          colors={['rgba(62, 238, 212, 0.45)', 'rgba(130, 155, 245, 0.35)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Rotating Cyber Energy Ring */}
      <Animated.View style={[styles.rotatingRing, animatedRotate]}>
        <LinearGradient
          colors={['rgba(62, 238, 212, 0.8)', 'transparent', 'rgba(130, 155, 245, 0.8)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ringGradient}
        />
      </Animated.View>

      {/* Main Hero Launch Core */}
      <Animated.View style={[styles.launchCore, animatedScale]}>
        <LinearGradient
          colors={['#1E274A', '#0F3832', '#25A18E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.coreGradient}
        >
          <Animated.View style={[styles.innerSparkle, animatedInner]}>
            <Text style={styles.rocketIcon}>✨</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Floating Accent Tag */}
      <View style={styles.launchTag}>
        <View style={styles.livePulseDot} />
        <Text style={styles.launchTagText}>CODE-A-THON PLATFORM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  ambientFlare: {
    position: 'absolute',
    width: 240,
    height: 200,
    borderRadius: 120,
    overflow: 'hidden',
  },
  rotatingRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    padding: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
  },
  launchCore: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    shadowColor: '#3EEED4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  coreGradient: {
    flex: 1,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  innerSparkle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketIcon: {
    fontSize: 26,
  },
  launchTag: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(62, 238, 212, 0.4)',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3EEED4',
  },
  launchTagText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
