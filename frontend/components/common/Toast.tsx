import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme } from '../../theme/config';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onDismiss,
  durationMs = 3200,
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: DefaultTheme.colors.successBg, border: DefaultTheme.colors.success, text: '#065F46', icon: DefaultTheme.colors.success };
      case 'error':
        return { bg: DefaultTheme.colors.errorBg, border: DefaultTheme.colors.error, text: '#991B1B', icon: DefaultTheme.colors.error };
      case 'info':
      default:
        return { bg: '#F4F4F5', border: DefaultTheme.colors.accent, text: DefaultTheme.colors.text, icon: DefaultTheme.colors.accent };
    }
  };

  const stylesColors = getColors();

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(150)}
      style={[
        styles.container,
        {
          top: (insets.top || 16) + 12,
          backgroundColor: stylesColors.bg,
          borderColor: stylesColors.border,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`${type} notification: ${message}`}
    >
      <View style={styles.content}>
        <Ionicons name={getIconName()} size={20} color={stylesColors.icon} style={styles.icon} />
        <Text style={[styles.message, { color: stylesColors.text }]}>{message}</Text>
      </View>
      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Dismiss toast notification"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={18} color={stylesColors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: DefaultTheme.radii.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    flex: 1,
  },
});
