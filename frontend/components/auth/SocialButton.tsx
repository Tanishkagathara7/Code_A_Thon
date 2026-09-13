import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { GoogleIcon, GitHubIcon } from '../icons/Icons';
import { AppTheme, DefaultTheme } from '../../theme/config';
import { Typography } from '../../theme/typography';

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
            borderRadius: 14,
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
            borderRadius: 14,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginVertical: 6,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  btnText: {
    fontFamily: Typography.socialButton.fontFamily,
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
