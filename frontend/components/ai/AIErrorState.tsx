import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii } from '../../theme/colors';

interface AIErrorStateProps {
  errorMessage: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AIErrorState: React.FC<AIErrorStateProps> = ({
  errorMessage,
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]} testID="ai-error-state">
      <View style={styles.contentRow}>
        <Ionicons name="alert-circle-outline" size={20} color={Colors.error} style={styles.icon} />
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>

      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} testID="ai-error-retry">
          <Ionicons name="refresh-outline" size={14} color={Colors.error} style={styles.retryIcon} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.sm + 4,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs + 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  retryIcon: {
    marginRight: 4,
  },
  retryText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
});
