import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Typography, Spacing } from '../../theme/typography';

interface HeaderSectionProps {
  authMode: 'login' | 'signup';
  onSkip?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ authMode, onSkip }) => {
  const isLogin = authMode === 'login';

  return (
    <View style={styles.container}>
      {/* Brand row: MindBloom on left, Skip pill button on right */}
      <View style={styles.topRow}>
        <Text style={Typography.brand}>MindBloom</Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onSkip}
          style={styles.skipButton}
          accessibilityLabel="Skip authentication"
          accessibilityRole="button"
        >
          <Text style={Typography.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Headline & Supporting Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.headline}>
          {isLogin ? 'Enter Your Space' : 'Unlock Your Future'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Log in to explore and bring your creative ideas to life on MindBloom, where inspiration meets.'
            : 'Sign up today to explore, organize, and bring your creative ideas to life on MindBloom.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 17,
    paddingVertical: 7,
    borderRadius: Spacing.pillRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textContainer: {
    gap: 10,
  },
  headline: {
    ...Typography.headline,
  },
  subtitle: {
    ...Typography.subtitle,
  },
});
