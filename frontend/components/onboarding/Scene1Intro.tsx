import React from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';

interface SceneProps {
  index: number;
  scrollX: SharedValue<number>;
}

export const Scene1Intro: React.FC<SceneProps> = ({ index, scrollX }) => {
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

  // Choreographed Typography Motion
  const typographyStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-40, 0, 40],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  // Choreographed Poster Artwork Parallax & Motion
  const posterStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [60, 0, -80],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-8, -4, 2],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.92],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, { width: SCREEN_WIDTH }, containerAnimatedStyle]}>
      {/* Editorial Headline & Metadata Section */}
      <Animated.View style={[styles.textWrapper, typographyStyle]}>
        <Text style={styles.kicker}>01 / INTRODUCING</Text>
        <Text style={styles.headline}>Built to Create.</Text>
        <Text style={styles.headlineEmphasized}>Designed to Explore.</Text>
        
        <View style={styles.divider} />

        <Text style={styles.subtext}>
          An experience created for Code-A-Thon.
        </Text>
      </Animated.View>

      {/* Poster Composition Frame */}
      <View style={styles.posterCompositionContainer}>
        {/* Ambient Backlight Glow */}
        <View style={styles.posterBacklight} />

        <Animated.View style={[styles.posterFrame, posterStyle]}>
          <Image
            source={require('../../assets/code.png')}
            style={styles.posterImage}
            resizeMode="contain"
          />
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
    marginBottom: 12,
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
    marginTop: 20,
    marginBottom: 14,
    borderRadius: 1,
  },
  subtext: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5C5852',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  posterCompositionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  posterBacklight: {
    position: 'absolute',
    width: 240,
    height: 160,
    borderRadius: 120,
    backgroundColor: 'rgba(238, 93, 137, 0.15)',
  },
  posterFrame: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
});
