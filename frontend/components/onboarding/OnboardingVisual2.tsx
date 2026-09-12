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

export const OnboardingVisual2: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 340);

  // Floating animations for layers
  const layer1Y = useSharedValue(0);
  const layer2Y = useSharedValue(0);
  const layer3Y = useSharedValue(0);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    layer1Y.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
        withTiming(6, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    layer2Y.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-8, { duration: 2700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    layer3Y.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(10, { duration: 3100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    badgeScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.97, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedLayer1 = useAnimatedStyle(() => ({
    transform: [{ translateY: layer1Y.value }],
  }));

  const animatedLayer2 = useAnimatedStyle(() => ({
    transform: [{ translateY: layer2Y.value }],
  }));

  const animatedLayer3 = useAnimatedStyle(() => ({
    transform: [{ translateY: layer3Y.value }],
  }));

  const animatedBadge = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Background Glow */}
      <View style={styles.glowBg}>
        <LinearGradient
          colors={['rgba(130, 155, 245, 0.3)', 'rgba(62, 238, 212, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Layer 3: Backing Workspace Canvas Grid */}
      <Animated.View style={[styles.layerBack, animatedLayer3]}>
        <View style={styles.canvasHeader}>
          <Text style={styles.canvasTitle}>Crafted Workspace</Text>
        </View>
        <View style={styles.canvasNodes}>
          <View style={styles.nodePoint} />
          <View style={styles.nodeLine} />
          <View style={styles.nodePoint} />
        </View>
      </Animated.View>

      {/* Layer 2: UI Component Spec Layer */}
      <Animated.View style={[styles.layerMid, animatedLayer2]}>
        <LinearGradient
          colors={['rgba(30, 41, 79, 0.88)', 'rgba(15, 23, 42, 0.95)']}
          style={styles.layerMidGradient}
        >
          <View style={styles.specHeader}>
            <Text style={styles.specTag}>{"<Component />"}</Text>
            <View style={styles.statusDot} />
          </View>
          <View style={styles.specBarContainer}>
            <View style={[styles.specBar, { width: '75%', backgroundColor: '#3EEED4' }]} />
            <View style={[styles.specBar, { width: '45%', backgroundColor: '#829BF5' }]} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Layer 1: Front Polish Card Layer */}
      <Animated.View style={[styles.layerFront, animatedLayer1]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.layerFrontGradient}
        >
          <View style={styles.creatorHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>T</Text>
            </View>
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>Tanish</Text>
              <Text style={styles.creatorRole}>Lead Architect & Developer</Text>
            </View>
          </View>

          {/* Interactive Toggle Switch Mock */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Fluid Micro-Animations</Text>
            <View style={styles.togglePill}>
              <View style={styles.toggleCircle} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Mandatory Subtle Text Element: "Design × Code × Creativity" */}
      <Animated.View style={[styles.craftBadgeContainer, animatedBadge]}>
        <LinearGradient
          colors={['#829BF5', '#3EEED4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.craftBadgeBorder}
        >
          <View style={styles.craftBadgeContent}>
            <Text style={styles.craftBadgeText}>Design × Code × Creativity</Text>
          </View>
        </LinearGradient>
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
  glowBg: {
    position: 'absolute',
    width: 250,
    height: 190,
    borderRadius: 125,
    overflow: 'hidden',
  },
  layerBack: {
    position: 'absolute',
    top: 10,
    width: '82%',
    height: 110,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    justifyContent: 'space-between',
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  canvasTitle: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  canvasNodes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nodePoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#829BF5',
  },
  nodeLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(130, 155, 245, 0.3)',
  },
  layerMid: {
    position: 'absolute',
    top: 42,
    width: '88%',
    height: 110,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  layerMidGradient: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'space-between',
  },
  specHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specTag: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#3EEED4',
    fontWeight: '700',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  specBarContainer: {
    gap: 6,
  },
  specBar: {
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  layerFront: {
    position: 'absolute',
    top: 74,
    width: '94%',
    height: 105,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#829BF5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  layerFrontGradient: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(24, 32, 60, 0.75)',
    justifyContent: 'space-between',
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#829BF5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#829BF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
  },
  creatorInfo: {
    gap: 1,
  },
  creatorName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  creatorRole: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  toggleLabel: {
    color: '#E0C8FF',
    fontSize: 11,
    fontWeight: '600',
  },
  togglePill: {
    width: 28,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3EEED4',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggleCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0F3832',
  },
  craftBadgeContainer: {
    position: 'absolute',
    bottom: -6,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
  },
  craftBadgeBorder: {
    padding: 1.2,
    borderRadius: 20,
  },
  craftBadgeContent: {
    backgroundColor: '#1E274A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 19,
  },
  craftBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
