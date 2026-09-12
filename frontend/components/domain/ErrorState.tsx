import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load data. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>⚠️</Text>
      </View>
      <Text style={styles.title}>Unable to Load Data</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryText}>Retry Request</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    marginVertical: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  message: {
    fontSize: 13.5,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
