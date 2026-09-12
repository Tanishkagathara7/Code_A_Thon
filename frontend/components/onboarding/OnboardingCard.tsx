import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../../theme/typography';

interface OnboardingCardProps {
  index: number;
  scrollX: SharedValue<number>;
  title: string;
  subtitle: string;
  visualComponent: React.ReactNode;
  reduceMotion?: boolean;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  index,
  scrollX,
  title,
  subtitle,
  visualComponent,
  reduceMotion = false,
}) => {
  const { width } = useWindowDimensions();

  // Scroll animations for Card scale, opacity, visual parallax & text offset
  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { opacity: 1 };
    }

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.2, 1, 0.2],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const visualAnimatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { transform: [{ translateY: 0 }] };
    }

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [-24, 0, 24],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { transform: [{ translateX: 0 }] };
    }

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [36, 0, -36],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={[styles.cardOuter, { width }]}>
      <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Card Visual Artwork Section */}
          <Animated.View style={[styles.visualWrapper, visualAnimatedStyle]}>
            {visualComponent}
          </Animated.View>

          {/* Card Text Information Section */}
          <Animated.View style={[styles.textWrapper, textAnimatedStyle]}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardGradient: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 26,
    alignItems: 'center',
  },
  visualWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    gap: 8,
  },
  cardTitle: {
    ...Typography.headline,
    fontSize: 26,
    lineHeight: 33,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  cardSubtitle: {
    ...Typography.subtitle,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.82)',
  },
});
