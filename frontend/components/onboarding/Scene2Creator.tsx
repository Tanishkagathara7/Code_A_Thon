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

export const Scene2Creator: React.FC<SceneProps> = ({ index, scrollX }) => {
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

  // Choreographed Typography Animation
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

  // Hero Portrait Editorial Parallax Animation
  const photoStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [80, 0, -80],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.95],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, { width: SCREEN_WIDTH }, containerAnimatedStyle]}>
      {/* Editorial Headline Section */}
      <Animated.View style={[styles.textWrapper, textStyle]}>
        <Text style={styles.kicker}>02 / THE CREATOR</Text>
        <Text style={styles.headline}>Made by Tanish.</Text>

        <Text style={styles.subtext}>
          Designed, developed, and brought to life for Code-A-Thon.
        </Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Design × Code × Creativity</Text>
        </View>
      </Animated.View>

      {/* Hero Photographic Editorial Frame */}
      <View style={styles.photoContainer}>
        {/* Soft Silhouette Backlight */}
        <View style={styles.backlightGlow} />

        <Animated.View style={[styles.photoFrame, photoStyle]}>
          <Image
            source={require('../../assets/tanish.jpg')}
            style={styles.portraitImage}
            resizeMode="cover"
          />

          {/* Editorial Watermark / Signature Badge */}
          <View style={styles.signatureBadge}>
            <Text style={styles.signatureName}>TANISH GATHARA</Text>
            <Text style={styles.signatureRole}>CREATIVE DEVELOPER</Text>
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
    paddingBottom: 20,
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
    fontSize: 38,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1.2,
    lineHeight: 44,
    marginBottom: 10,
  },
  subtext: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5C5852',
    letterSpacing: -0.2,
    lineHeight: 22,
    maxWidth: 280,
  },
  tagContainer: {
    marginTop: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
  },
  backlightGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    bottom: 20,
  },
  photoFrame: {
    width: '100%',
    height: '88%',
    maxHeight: 340,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 10,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  signatureBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signatureName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  signatureRole: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
