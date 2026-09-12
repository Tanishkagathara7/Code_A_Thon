import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GoogleIcon, GitHubIcon, AppleIcon } from '../icons/Icons';
import { AppTheme, DefaultTheme } from '../../theme/config';

interface SocialButtonProps {
  onGooglePress: () => void;
  onGitHubPress: () => void;
  googleLoading?: boolean;
  gitHubLoading?: boolean;
  theme?: AppTheme;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  onGooglePress,
  onGitHubPress,
  googleLoading = false,
  gitHubLoading = false,
  theme = DefaultTheme,
}) => {
  const handleApplePress = () => {
    Alert.alert(
      'Apple Sign In',
      'Apple Sign In is enabled for iOS devices and supported web configurations.'
    );
  };

  return (
    <View style={styles.container}>
      {/* Google Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onGooglePress}
        disabled={googleLoading || gitHubLoading}
        style={[
          styles.socialBtn,
          {
            backgroundColor: theme.colors.socialBg,
            borderColor: theme.colors.socialBorder,
            borderRadius: theme.radii.md,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        {googleLoading ? (
          <ActivityIndicator color={theme.colors.text} size="small" />
        ) : (
          <>
            <GoogleIcon size={18} />
            <Text style={[styles.btnText, { color: theme.colors.socialText }]}>
              Google
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* GitHub Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onGitHubPress}
        disabled={googleLoading || gitHubLoading}
        style={[
          styles.socialBtn,
          {
            backgroundColor: theme.colors.socialBg,
            borderColor: theme.colors.socialBorder,
            borderRadius: theme.radii.md,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Continue with GitHub"
      >
        {gitHubLoading ? (
          <ActivityIndicator color={theme.colors.text} size="small" />
        ) : (
          <>
            <GitHubIcon size={18} color={theme.colors.text} />
            <Text style={[styles.btnText, { color: theme.colors.socialText }]}>
              GitHub
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleApplePress}
        disabled={googleLoading || gitHubLoading}
        style={[
          styles.socialBtn,
          {
            backgroundColor: theme.colors.socialBg,
            borderColor: theme.colors.socialBorder,
            borderRadius: theme.radii.md,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Continue with Apple"
      >
        <AppleIcon size={18} color={theme.colors.text} />
        <Text style={[styles.btnText, { color: theme.colors.socialText }]}>
          Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginVertical: 4,
  },
  socialBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
