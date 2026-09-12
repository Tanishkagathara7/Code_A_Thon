import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

interface SceneProps {
  index: number;
  scrollX: SharedValue<number>;
  onGetStarted: () => void;
  onLoginPress: () => void;
}

export const Scene5Enter: React.FC<SceneProps> = ({
  index,
  scrollX,
  onGetStarted,
  onLoginPress,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const buttonScale = useSharedValue(1);

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

  const callbackStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={[styles.container, { width: SCREEN_WIDTH }, containerAnimatedStyle]}>
      {/* Visual Callbacks Composition Frame */}
      <View style={styles.callbackCompositionContainer}>
        {/* Soft Ambient Backdrop Light */}
        <View style={styles.ambientBackdrop} />

        <Animated.View style={[styles.callbackFrame, callbackStyle]}>
          {/* Overlapping Callbacks */}
          <View style={styles.callbackImageWrapperLeft}>
            <Image
              source={require('../../assets/tanish.jpg')}
              style={styles.callbackImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.callbackImageWrapperRight}>
            <Image
              source={require('../../assets/code.png')}
              style={styles.callbackImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>

      {/* Editorial Headline & Call-To-Action Section */}
      <Animated.View style={[styles.bottomSection, textStyle]}>
        <Text style={styles.kicker}>03 / GET STARTED</Text>
        <Text style={styles.headline}>Ready to Explore?</Text>

        <Text style={styles.subtext}>
          Let's get started.
        </Text>

        {/* Primary CTA Button: Get Started → */}
        <Animated.View style={[styles.ctaWrapper, buttonAnimatedStyle]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onGetStarted}
            style={styles.getStartedButton}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.getStartedText}>Get Started →</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary Link: Already have an account? Log in */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLoginPress}
          style={styles.loginLink}
          accessibilityRole="button"
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkHighlight}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
  callbackCompositionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  ambientBackdrop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
  },
  callbackFrame: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  callbackImageWrapperLeft: {
    position: 'absolute',
    left: '18%',
    width: 120,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    transform: [{ rotate: '-6deg' }],
  },
  callbackImageWrapperRight: {
    position: 'absolute',
    right: '18%',
    width: 130,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    transform: [{ rotate: '8deg' }],
  },
  callbackImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    marginBottom: 8,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#8A8680',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 38,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1.2,
    lineHeight: 44,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 16,
    fontWeight: '400',
    color: '#5C5852',
    letterSpacing: -0.2,
    lineHeight: 24,
    marginBottom: 20,
  },
  ctaWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
  },
  loginLinkHighlight: {
    color: '#0F172A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
