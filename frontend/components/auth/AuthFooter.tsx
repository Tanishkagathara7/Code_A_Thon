import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AuthMode } from './AuthHero';
import { AppTheme, DefaultTheme } from '../../theme/config';

interface AuthFooterProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  theme?: AppTheme;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  mode,
  onModeChange,
  theme = DefaultTheme,
}) => {
  const getContent = () => {
    switch (mode) {
      case 'login':
        return {
          label: "Don't have an account?",
          action: 'Sign up',
          nextMode: 'signup' as AuthMode,
        };
      case 'signup':
        return {
          label: 'Already have an account?',
          action: 'Sign in',
          nextMode: 'login' as AuthMode,
        };
      case 'forgot-password':
        return {
          label: 'Remember your password?',
          action: 'Sign in',
          nextMode: 'login' as AuthMode,
        };
    }
  };

  const { label, action, nextMode } = getContent();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onModeChange(nextMode)}
        accessibilityRole="button"
        accessibilityLabel={action}
      >
        <Text style={[styles.text, { color: theme.colors.mutedText }]}>
          {label}{' '}
          <Text style={[styles.action, { color: theme.colors.text }]}>
            {action}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 4,
  },
  text: {
    fontSize: 14.5,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  action: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
