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

export const OnboardingVisual4: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 340);

  // Floating animation values
  const floatY = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.7);
  const nodePulse = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 2700, easing: Easing.inOut(Easing.quad) }),
        withTiming(5, { duration: 2900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2300, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 })
      ),
      -1,
      true
    );

    nodePulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800 }),
        withTiming(0.9, { duration: 1800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedFloat = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedPulse = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const animatedNode = useAnimatedStyle(() => ({
    transform: [{ scale: nodePulse.value }],
  }));

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Background Cyber Ambient Glow */}
      <View style={styles.glowBg}>
        <LinearGradient
          colors={['rgba(62, 238, 212, 0.3)', 'rgba(30, 56, 50, 0.5)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Cyber Network Connecting Lines */}
      <View style={styles.networkLines}>
        <View style={styles.lineDiagonal} />
        <View style={[styles.lineDiagonal, { transform: [{ rotate: '-35deg' }] }]} />
      </View>

      {/* Connected Network Nodes */}
      <Animated.View style={[styles.nodeCircle1, animatedNode]}>
        <Text style={styles.nodeIcon}>⚡</Text>
      </Animated.View>

      <Animated.View style={[styles.nodeCircle2, animatedNode]}>
        <Text style={styles.nodeIcon}>🚀</Text>
      </Animated.View>

      {/* Hackathon Terminal Container */}
      <Animated.View style={[styles.terminalWindow, animatedFloat]}>
        {/* Terminal Header */}
        <View style={styles.terminalHeader}>
          <View style={styles.terminalDots}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.terminalTitle}>hackathon-cli v2026.1</Text>
        </View>

        {/* Terminal Output */}
        <View style={styles.terminalBody}>
          <View style={styles.commandLine}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.commandText}>code-a-thon --build --mode=hack</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusPrefix}>[STATUS]</Text>
            <Text style={styles.statusText}>Compiling innovation modules...</Text>
          </View>

          {/* Animated Progress Bar */}
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#3EEED4', '#829BF5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </View>

          <View style={styles.successRow}>
            <Animated.View style={[styles.blinkingDot, animatedPulse]} />
            <Text style={styles.successText}>100% Ready for Submission</Text>
          </View>
        </View>
      </Animated.View>

      {/* Mandatory Badge Element: CODE-A-THON 2026 */}
      <View style={styles.hackathonBadge}>
        <LinearGradient
          colors={['#0F3832', '#1D7567']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hackathonBadgeGradient}
        >
          <View style={styles.badgeSparkDot} />
          <Text style={styles.hackathonBadgeText}>CODE-A-THON 2026</Text>
        </LinearGradient>
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
    width: 250,
    height: 190,
    borderRadius: 125,
    overflow: 'hidden',
  },
  networkLines: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.25,
  },
  lineDiagonal: {
    width: 220,
    height: 1,
    backgroundColor: '#3EEED4',
    transform: [{ rotate: '35deg' }],
  },
  nodeCircle1: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 56, 50, 0.9)',
    borderWidth: 1,
    borderColor: '#3EEED4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCircle2: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 39, 74, 0.9)',
    borderWidth: 1,
    borderColor: '#829BF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeIcon: {
    fontSize: 14,
  },
  terminalWindow: {
    width: '92%',
    borderRadius: 18,
    backgroundColor: 'rgba(10, 16, 28, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(62, 238, 212, 0.3)',
    overflow: 'hidden',
    shadowColor: '#3EEED4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  terminalHeader: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  terminalDots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  terminalTitle: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.55)',
    letterSpacing: 0.3,
  },
  terminalBody: {
    padding: 14,
    gap: 8,
  },
  commandLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptSymbol: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#3EEED4',
    fontWeight: '700',
  },
  commandText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPrefix: {
    fontFamily: 'monospace',
    fontSize: 10.5,
    color: '#F59E0B',
    fontWeight: '700',
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 2,
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3EEED4',
  },
  successText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#3EEED4',
    fontWeight: '700',
  },
  hackathonBadge: {
    position: 'absolute',
    bottom: -6,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(62, 238, 212, 0.6)',
    elevation: 6,
  },
  hackathonBadgeGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  badgeSparkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3EEED4',
  },
  hackathonBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});
