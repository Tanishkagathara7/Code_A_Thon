import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { GoogleIcon, GitHubIcon } from '../icons/Icons';

interface SceneProps {
  index: number;
  scrollX: SharedValue<number>;
}

export const Scene3Auth: React.FC<SceneProps> = ({ index, scrollX }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  // Typography choreography
  const textStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [-30, 0, 30],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Interlocking Brand Mark Composition Animation
  const authVisualStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.88],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [6, 0, -6],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.container, { width: SCREEN_WIDTH }, containerAnimatedStyle]}>
      {/* Editorial Text Section */}
      <Animated.View style={[styles.textWrapper, textStyle]}>
        <Text style={styles.kicker}>03 / AUTHENTICATION</Text>
        <Text style={styles.headline}>Your Login.</Text>
        <Text style={styles.headlineEmphasized}>Your Way.</Text>

        <View style={styles.divider} />

        <Text style={styles.subtext}>
          Continue with Google or GitHub and get straight into the experience.
        </Text>
      </Animated.View>

      {/* Brand Composition Frame */}
      <View style={styles.visualContainer}>
        {/* Soft Radial Aura */}
        <View style={styles.radialAura} />

        <Animated.View style={[styles.brandCompositionFrame, authVisualStyle]}>
          {/* Orbital Ring 1 */}
          <View style={styles.orbitalRingOuter} />
          <View style={styles.orbitalRingInner} />

          {/* Provider Vector Nodes */}
          <View style={styles.nodesWrapper}>
            {/* Google Provider Mark Frame */}
            <View style={[styles.providerNode, styles.googleNode]}>
              <GoogleIcon size={38} />
              <Text style={styles.providerLabel}>Google</Text>
            </View>

            {/* Connecting Bridge Line */}
            <View style={styles.connectBridge}>
              <View style={styles.bridgeDot} />
              <View style={styles.bridgeLine} />
              <View style={styles.bridgeDot} />
            </View>

            {/* GitHub Provider Mark Frame */}
            <View style={[styles.providerNode, styles.githubNode]}>
              <GitHubIcon size={38} color="#0F172A" />
              <Text style={styles.providerLabel}>GitHub</Text>
            </View>
          </View>

          {/* Minimal Meta Label */}
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>ONE-TAP OAuth 2.0</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
  },
  textWrapper: {
    marginTop: 12,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#8A8680',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 36,
    fontWeight: '300',
    color: '#1A1918',
    letterSpacing: -1,
    lineHeight: 42,
  },
  headlineEmphasized: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  divider: {
    width: 36,
    height: 2,
    backgroundColor: '#0F172A',
    marginTop: 18,
    marginBottom: 14,
    borderRadius: 1,
  },
  subtext: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5C5852',
    letterSpacing: -0.2,
    lineHeight: 22,
    maxWidth: 290,
  },
  visualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
  },
  radialAura: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  brandCompositionFrame: {
    width: '100%',
    height: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  orbitalRingOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.04)',
  },
  orbitalRingInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
    borderStyle: 'dashed',
  },
  nodesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 2,
  },
  providerNode: {
    width: 90,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    gap: 8,
  },
  googleNode: {
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  githubNode: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  providerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: -0.2,
  },
  connectBridge: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    justifyContent: 'space-between',
  },
  bridgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366F1',
  },
  bridgeLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  metaChip: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  metaChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },
});
