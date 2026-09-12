import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
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
      {/* Abstract Precision Geometric Logo Mark + App Title */}
      <View style={styles.brandRow}>
        <Svg width={28} height={28} viewBox="0 0 32 32" fill="none">
          <Rect x={4} y={4} width={24} height={24} rx={7} fill={theme.colors.accent} />
          <Circle cx={16} cy={16} r={6} fill={theme.colors.background} />
          <Path d="M 12 16 L 20 16" stroke={theme.colors.accent} strokeWidth={2} strokeLinecap="round" />
        </Svg>
        {theme.logoText ? (
          <Text style={[styles.brandText, { color: theme.colors.text }]}>
            {theme.logoText}
          </Text>
        ) : null}
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
    gap: 10,
  },
  brandText: {
    fontSize: 17,
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
