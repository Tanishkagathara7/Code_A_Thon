import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedAtmosphereProps {
  authMode: 'login' | 'signup';
}

export const AnimatedAtmosphere: React.FC<AnimatedAtmosphereProps> = ({ authMode }) => {
  const { width, height } = useWindowDimensions();

  // Mode transition progress: 0 = login (twilight/lavender-blue), 1 = signup (mint/emerald)
  const modeProgress = useSharedValue(authMode === 'login' ? 0 : 1);

  // Interactive mouse/touch parallax offset
  const pointerX = useSharedValue(0);
  const pointerY = useSharedValue(0);

  // Organic floating orb translations
  const orb1X = useSharedValue(0);
  const orb1Y = useSharedValue(0);
  const orb1Scale = useSharedValue(1);

  const orb2X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2Scale = useSharedValue(1);

  const orb3X = useSharedValue(0);
  const orb3Y = useSharedValue(0);

  useEffect(() => {
    modeProgress.value = withTiming(authMode === 'login' ? 0 : 1, {
      duration: 700,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [authMode]);

  useEffect(() => {
    // Gentle continuous organic floating
    orb1X.value = withRepeat(
      withSequence(
        withTiming(32, { duration: 6500, easing: Easing.inOut(Easing.quad) }),
        withTiming(-24, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-38, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(28, { duration: 7000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb1Scale.value = withRepeat(
      withSequence(
        withTiming(1.14, { duration: 8500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.94, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 6500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-35, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(26, { duration: 8500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(32, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(-28, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb2Scale.value = withRepeat(
      withSequence(
        withTiming(0.92, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.16, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 7500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    orb3X.value = withRepeat(
      withSequence(
        withTiming(22, { duration: 6000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-30, { duration: 7000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 5500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    orb3Y.value = withRepeat(
      withSequence(
        withTiming(-24, { duration: 6500, easing: Easing.inOut(Easing.quad) }),
        withTiming(22, { duration: 7500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  // Web mouse move listener for interactive depth parallax
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 35;
        const normY = (e.clientY / window.innerHeight - 0.5) * 35;
        pointerX.value = withSpring(normX, { damping: 15, stiffness: 90 });
        pointerY.value = withSpring(normY, { damping: 15, stiffness: 90 });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const animatedOrb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1X.value + pointerX.value * 0.8 },
      { translateY: orb1Y.value + pointerY.value * 0.8 },
      { scale: orb1Scale.value },
    ],
  }));

  const animatedOrb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2X.value - pointerX.value * 0.6 },
      { translateY: orb2Y.value - pointerY.value * 0.6 },
      { scale: orb2Scale.value },
    ],
  }));

  const animatedOrb3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb3X.value + pointerX.value * 0.4 },
      { translateY: orb3Y.value + pointerY.value * 0.4 },
    ],
  }));

  const loginLayerStyle = useAnimatedStyle(() => ({
    opacity: 1 - modeProgress.value,
  }));

  const signupLayerStyle = useAnimatedStyle(() => ({
    opacity: modeProgress.value,
  }));

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.container]}>
      {/* Base Background: Login Mode (Deep rich twilight indigo to royal lavender gradient) */}
      <Animated.View style={[StyleSheet.absoluteFill, loginLayerStyle]}>
        <LinearGradient
          colors={['#1E274A', '#2D3A6B', '#485897', '#7386C8', '#A2B4E9']}
          locations={[0, 0.25, 0.52, 0.78, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        {/* Soft luminous royal lavender-blue radial ambient glow */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              width: width * 1.35,
              height: width * 1.35,
              top: -width * 0.35,
              left: -width * 0.25,
            },
            animatedOrb1Style,
          ]}
        >
          <LinearGradient
            colors={['rgba(130, 155, 245, 0.65)', 'rgba(88, 115, 205, 0.3)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Right soft highlight aura */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              width: width * 1.2,
              height: width * 1.2,
              top: height * 0.04,
              right: -width * 0.32,
            },
            animatedOrb2Style,
          ]}
        >
          <LinearGradient
            colors={['rgba(175, 198, 255, 0.55)', 'rgba(120, 148, 235, 0.25)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>
      </Animated.View>

      {/* Base Background: Sign Up Mode (Deep luxury emerald teal to glowing aurora mint) */}
      <Animated.View style={[StyleSheet.absoluteFill, signupLayerStyle]}>
        <LinearGradient
          colors={['#0F3832', '#155248', '#1D7567', '#25A18E', '#48E5CE']}
          locations={[0, 0.22, 0.48, 0.75, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.12, y: 0 }}
          end={{ x: 0.88, y: 1 }}
        />
        {/* Mint luminous highlight glow */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              width: width * 1.3,
              height: width * 1.3,
              top: -width * 0.3,
              right: -width * 0.2,
            },
            animatedOrb1Style,
          ]}
        >
          <LinearGradient
            colors={['rgba(62, 238, 212, 0.55)', 'rgba(28, 180, 158, 0.28)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Emerald jade soft glow aura */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              width: width * 1.15,
              height: width * 1.15,
              top: height * 0.06,
              left: -width * 0.25,
            },
            animatedOrb2Style,
          ]}
        >
          <LinearGradient
            colors={['rgba(110, 250, 230, 0.48)', 'rgba(24, 140, 122, 0.22)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>
      </Animated.View>

      {/* Subtle translucent veil */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.02)', 'transparent']}
        style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1E274A',
  },
  glowContainer: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
});
