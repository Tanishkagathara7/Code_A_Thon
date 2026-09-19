import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { AppTheme, DefaultTheme } from '../../theme/config';

interface AuthHeaderProps {
  theme?: AppTheme;
  onGuestPress?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  theme = DefaultTheme,
  onGuestPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Brand Logo Mark + App Title */}
      <View style={styles.brandRow}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <Text style={[styles.brandText, { color: theme.colors.text }]}>
          {theme.logoText || 'GST Billing'}
        </Text>
      </View>

      {/* Guest Action Option */}
      {onGuestPress && (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onGuestPress}
          style={[styles.guestButton, { borderColor: theme.colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Continue as guest"
        >
          <Text style={[styles.guestButtonText, { color: theme.colors.mutedText }]}>
            Guest
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  guestButton: {
    paddingHorizontal: 13,
    paddingVertical: 4.5,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  guestButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
