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
import { GoogleIcon, GitHubIcon, KeyIcon } from '../icons/Icons';

export const OnboardingVisual3: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 340);

  // Animations for floating orb badges
  const orb1Y = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(6, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    orb2Y.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
        withTiming(-6, { duration: 3100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedOrb1 = useAnimatedStyle(() => ({
    transform: [{ translateY: orb1Y.value }],
  }));

  const animatedOrb2 = useAnimatedStyle(() => ({
    transform: [{ translateY: orb2Y.value }],
  }));

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Background Glow */}
      <View style={styles.glowBg}>
        <LinearGradient
          colors={['rgba(130, 155, 245, 0.25)', 'rgba(62, 238, 212, 0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Orbit Rings */}
      <View style={styles.orbitRingOuter} />
      <View style={styles.orbitRingInner} />

      {/* Central Security Shield Core */}
      <Animated.View style={[styles.centralCore, animatedPulse]}>
        <LinearGradient
          colors={['#2D3A6B', '#1E274A']}
          style={styles.coreGradient}
        >
          <View style={styles.coreIconWrapper}>
            <KeyIcon size={24} color="#3EEED4" />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Auth Method Visual Element 1: Google Informational Badge */}
      <Animated.View style={[styles.providerBadgeLeft, animatedOrb1]}>
        <View style={styles.providerCardGlass}>
          <View style={styles.iconCircle}>
            <GoogleIcon size={20} />
          </View>
          <View style={styles.providerTextGroup}>
            <Text style={styles.providerTitle}>Google</Text>
            <Text style={styles.providerSub}>Single Tap Auth</Text>
          </View>
        </View>
      </Animated.View>

      {/* Auth Method Visual Element 2: GitHub Informational Badge */}
      <Animated.View style={[styles.providerBadgeRight, animatedOrb2]}>
        <View style={styles.providerCardGlass}>
          <View style={styles.iconCircle}>
            <GitHubIcon size={20} color="#FFFFFF" />
          </View>
          <View style={styles.providerTextGroup}>
            <Text style={styles.providerTitle}>GitHub</Text>
            <Text style={styles.providerSub}>Developer Sync</Text>
          </View>
        </View>
      </Animated.View>

      {/* Footer Informational Chip */}
      <View style={styles.securityChip}>
        <View style={styles.greenPulseDot} />
        <Text style={styles.securityChipText}>Secure OAuth 2.0 Integration</Text>
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
  glowBg: {
    position: 'absolute',
    width: 240,
    height: 200,
    borderRadius: 120,
    overflow: 'hidden',
  },
  orbitRingOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  orbitRingInner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(62, 238, 212, 0.25)',
  },
  centralCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    shadowColor: '#3EEED4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  coreGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(62, 238, 212, 0.6)',
    borderRadius: 34,
  },
  coreIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerBadgeLeft: {
    position: 'absolute',
    left: 4,
    top: 32,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  providerBadgeRight: {
    position: 'absolute',
    right: 4,
    bottom: 36,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  providerCardGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    gap: 9,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  providerTextGroup: {
    gap: 1,
  },
  providerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  providerSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontWeight: '500',
  },
  securityChip: {
    position: 'absolute',
    bottom: -4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  securityChipText: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10.5,
    fontWeight: '600',
  },
});
