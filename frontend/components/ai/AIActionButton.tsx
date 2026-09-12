import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii } from '../../theme/colors';

interface AIActionButtonProps {
  onPress: () => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const AIActionButton: React.FC<AIActionButtonProps> = ({
  onPress,
  title = 'Generate with AI',
  loading = false,
  disabled = false,
  style,
  textStyle,
  iconName = 'sparkles-outline',
}) => {
  const isButtonDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[
        styles.button,
        isButtonDisabled && styles.buttonDisabled,
        style,
      ]}
      testID="ai-action-button"
    >
      {loading ? (
        <ActivityIndicator color={Colors.accentText} size="small" style={styles.spinner} />
      ) : (
        <Ionicons name={iconName} size={18} color={Colors.accentText} style={styles.icon} />
      )}
      <Text style={[styles.text, textStyle]}>
        {loading ? 'Processing...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: Spacing.xs + 2,
  },
  spinner: {
    marginRight: Spacing.xs + 2,
  },
  text: {
    color: Colors.accentText,
    fontWeight: '600',
    fontSize: 14,
  },
});
