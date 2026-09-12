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

export const Scene4Hackathon: React.FC<SceneProps> = ({ index, scrollX }) => {
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

  // Typography animation
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

  // Hackathon Poster Floating Parallax Motion
  const artworkStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [90, 0, -90],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.88, 1, 0.9],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [4, 0, -4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.container, { width: SCREEN_WIDTH }, containerAnimatedStyle]}>
      {/* Editorial Text Section */}
      <Animated.View style={[styles.textWrapper, textStyle]}>
        <Text style={styles.kicker}>03 / THE EVENT</Text>
        <Text style={styles.headline}>Built for the</Text>
        <Text style={styles.headlineEmphasized}>Challenge.</Text>

        <View style={styles.divider} />

        <Text style={styles.subtext}>
          Created for Code-A-Thon — where ideas become experiences.
        </Text>
      </Animated.View>

      {/* Floating Cinematic Event Artwork Frame (No dark card container) */}
      <View style={styles.artworkContainer}>
        {/* Soft Multi-color Ambient Backlight */}
        <View style={styles.backlightMagenta} />
        <View style={styles.backlightCyan} />

        <Animated.View style={[styles.floatingArtworkWrapper, artworkStyle]}>
          <Image
            source={require('../../assets/code.png')}
            style={styles.artworkImage}
            resizeMode="contain"
          />

          {/* Minimal Event Metadata Footprint */}
          <View style={styles.eventBanner}>
            <View style={styles.eventDot} />
            <Text style={styles.eventBannerText}>HACKATHON EDITION 2026</Text>
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
  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  backlightMagenta: {
    position: 'absolute',
    width: 220,
    height: 160,
    borderRadius: 110,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    top: 10,
  },
  backlightCyan: {
    position: 'absolute',
    width: 220,
    height: 160,
    borderRadius: 110,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    bottom: 10,
  },
  floatingArtworkWrapper: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  artworkImage: {
    width: '100%',
    height: '85%',
  },
  eventBanner: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC4899',
  },
  eventBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.2,
  },
});
