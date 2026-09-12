import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AppTheme, DefaultTheme } from '../../theme/config';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthHeroProps {
  mode: AuthMode;
  theme?: AppTheme;
}

export const AuthHero: React.FC<AuthHeroProps> = ({
  mode,
  theme = DefaultTheme,
}) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Subtle 200ms stagger motion when switching modes
    opacity.value = 0;
    translateY.value = 6;
    opacity.value = withTiming(1, {
      duration: theme.animationDuration.normal,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(0, {
      duration: theme.animationDuration.normal,
      easing: Easing.out(Easing.quad),
    });
  }, [mode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getContent = () => {
    switch (mode) {
      case 'login':
        return {
          heading: 'Welcome back',
          subheading: 'Sign in to continue',
        };
      case 'signup':
        return {
          heading: 'Create your account',
          subheading: 'Start with a few details',
        };
      case 'forgot-password':
        return {
          heading: 'Reset your password',
          subheading: 'Enter your email to receive a verification code',
        };
    }
  };

  const { heading, subheading } = getContent();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textWrapper, animatedStyle]}>
        <Text style={[styles.headingText, { color: theme.colors.text }]}>
          {heading}
        </Text>
        <Text style={[styles.subheadingText, { color: theme.colors.mutedText }]}>
          {subheading}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  textWrapper: {
    gap: 4,
  },
  headingText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subheadingText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.1,
    lineHeight: 21,
  },
});
