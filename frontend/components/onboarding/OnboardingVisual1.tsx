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

export const OnboardingVisual1: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 340);

  // Floating animation values
  const floatY1 = useSharedValue(0);
  const floatY2 = useSharedValue(0);
  const pulseGlow = useSharedValue(0.6);
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    floatY1.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
        withTiming(4, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    floatY2.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-6, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedFloat1 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY1.value }],
  }));

  const animatedFloat2 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY2.value }],
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: pulseGlow.value,
  }));

  const animatedCursor = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Background ambient radial glow */}
      <Animated.View style={[styles.glowOrb, animatedGlow]}>
        <LinearGradient
          colors={['rgba(62, 238, 212, 0.35)', 'rgba(130, 155, 245, 0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Cyber Grid Lines */}
      <View style={styles.gridContainer}>
        <View style={styles.gridLineH} />
        <View style={[styles.gridLineH, { top: '35%' }]} />
        <View style={[styles.gridLineH, { top: '70%' }]} />
        <View style={styles.gridLineV} />
        <View style={[styles.gridLineV, { left: '35%' }]} />
        <View style={[styles.gridLineV, { left: '70%' }]} />
      </View>

      {/* Main Glass IDE Window */}
      <Animated.View style={[styles.ideWindow, animatedFloat1]}>
        {/* Header bar with window controls */}
        <View style={styles.ideHeader}>
          <View style={[styles.dotControl, { backgroundColor: '#FF5F56' }]} />
          <View style={[styles.dotControl, { backgroundColor: '#FFBD2E' }]} />
          <View style={[styles.dotControl, { backgroundColor: '#27C93F' }]} />
          <Text style={styles.ideTitle}>main.tsx — Code-A-Thon</Text>
        </View>

        {/* Code Content */}
        <View style={styles.ideBody}>
          <View style={styles.codeLine}>
            <Text style={styles.codeKeyword}>const</Text>
            <Text style={styles.codeVar}> app</Text>
            <Text style={styles.codeOp}> = </Text>

            <Text style={styles.codeFunc}>createExperience</Text>
            <Text style={styles.codeBracket}>({'{'}</Text>
          </View>

          <View style={[styles.codeLine, { paddingLeft: 16 }]}>
            <Text style={styles.codeProp}>event:</Text>
            <Text style={styles.codeString}> 'CODE-A-THON'</Text>
            <Text style={styles.codeComma}>,</Text>
          </View>

          <View style={[styles.codeLine, { paddingLeft: 16 }]}>
            <Text style={styles.codeProp}>mode:</Text>
            <Text style={styles.codeString}> 'innovate'</Text>
            <Text style={styles.codeComma}>,</Text>
          </View>

          <View style={[styles.codeLine, { paddingLeft: 16 }]}>
            <Text style={styles.codeProp}>status:</Text>
            <Text style={styles.codeString}> 'ready_to_build'</Text>
            <Animated.Text style={[styles.cursor, animatedCursor]}>|</Animated.Text>
          </View>

          <View style={styles.codeLine}>
            <Text style={styles.codeBracket}>{'}'});</Text>
          </View>
        </View>
      </Animated.View>

      {/* Floating Accent Badge 1: CODE-A-THON Label */}
      <Animated.View style={[styles.eventTagBadge, animatedFloat2]}>
        <LinearGradient
          colors={['rgba(62, 238, 212, 0.25)', 'rgba(45, 58, 107, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventTagGradient}
        >
          <View style={styles.sparkleDot} />
          <Text style={styles.eventTagText}>CODE-A-THON</Text>
        </LinearGradient>
      </Animated.View>

      {/* Floating Code Fragment Chip */}
      <Animated.View style={[styles.fragmentChip, animatedFloat1]}>
        <Text style={styles.fragmentText}>⚡ 60 FPS Smooth</Text>
      </Animated.View>
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
  glowOrb: {
    position: 'absolute',
    width: 260,
    height: 200,
    borderRadius: 130,
    overflow: 'hidden',
  },
  gridContainer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#3EEED4',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#829BF5',
  },
  ideWindow: {
    width: '92%',
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
    shadowColor: '#3EEED4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  ideHeader: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  dotControl: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  ideTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  ideBody: {
    padding: 14,
    gap: 4,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeKeyword: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#F472B6',
    fontWeight: '600',
  },
  codeVar: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#60A5FA',
  },
  codeOp: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#94A3B8',
  },
  codeFunc: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#34D399',
    fontWeight: '600',
  },
  codeBracket: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#F59E0B',
  },
  codeProp: {
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#A78BFA',
  },
  codeString: {
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#3EEED4',
  },
  codeComma: {
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#94A3B8',
  },
  cursor: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#3EEED4',
    fontWeight: '700',
    marginLeft: 2,
  },
  eventTagBadge: {
    position: 'absolute',
    top: -4,
    right: 4,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(62, 238, 212, 0.5)',
  },
  eventTagGradient: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparkleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3EEED4',
  },
  eventTagText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  fragmentChip: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    backgroundColor: 'rgba(30, 39, 74, 0.9)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(130, 155, 245, 0.4)',
  },
  fragmentText: {
    color: '#AFB8FF',
    fontSize: 10.5,
    fontWeight: '600',
  },
});
