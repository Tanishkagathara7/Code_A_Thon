import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Typography, Spacing } from '../../theme/typography';
import { GitHubIcon, GoogleIcon } from '../icons/Icons';

interface SocialAuthButtonsProps {
  onGitHubPress: () => void;
  onGooglePress: () => void;
  gitHubLoading?: boolean;
  googleLoading?: boolean;
}

const TactileSocialButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
}> = ({ title, icon, onPress, loading }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (loading) return;
    scale.value = withTiming(0.97, {
      duration: 140,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
        style={styles.socialButton}
        accessibilityRole="button"
        accessibilityLabel={`Sign in with ${title}`}
      >
        {loading ? (
          <ActivityIndicator color="#111315" size="small" />
        ) : (
          <View style={styles.contentRow}>
            <View style={styles.iconBox}>{icon}</View>
            <Text style={Typography.socialButton}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGitHubPress,
  onGooglePress,
  gitHubLoading = false,
  googleLoading = false,
}) => {
  return (
    <View style={styles.row}>
      <TactileSocialButton
        title="GitHub"
        icon={<GitHubIcon size={18} color="#111315" />}
        onPress={onGitHubPress}
        loading={gitHubLoading}
      />
      <TactileSocialButton
        title="Google"
        icon={<GoogleIcon size={18} />}
        onPress={onGooglePress}
        loading={googleLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
  socialButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.pillRadius,
    borderWidth: 1.2,
    borderColor: '#ECEEF2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      default: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.03)',
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
