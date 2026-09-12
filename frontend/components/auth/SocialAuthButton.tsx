import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { GoogleIcon, GitHubIcon } from '../icons/Icons';

interface SocialAuthButtonsProps {
  onGitHubPress: () => void;
  onGooglePress: () => void;
  gitHubLoading?: boolean;
  googleLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGitHubPress,
  onGooglePress,
  gitHubLoading = false,
  googleLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* GitHub Provider Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onGitHubPress}
        disabled={gitHubLoading || googleLoading}
        style={styles.socialButton}
        accessibilityRole="button"
        accessibilityLabel="Continue with GitHub"
      >
        {gitHubLoading ? (
          <ActivityIndicator color="#0F172A" size="small" />
        ) : (
          <>
            <GitHubIcon size={20} color="#0F172A" />
            <Text style={styles.buttonText}>GitHub</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Google Provider Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onGooglePress}
        disabled={gitHubLoading || googleLoading}
        style={styles.socialButton}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        {googleLoading ? (
          <ActivityIndicator color="#0F172A" size="small" />
        ) : (
          <>
            <GoogleIcon size={20} />
            <Text style={styles.buttonText}>Google</Text>
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
    gap: 12,
    width: '100%',
    marginTop: 10,
  },
  socialButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: -0.2,
  },
});
