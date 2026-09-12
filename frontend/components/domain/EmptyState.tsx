import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to display right now. Create your first item to get started!',
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>📦</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4F46E5', '#4338CA']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 4px 10px rgba(24, 24, 27, 0.04))',
      },
    }),
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#09090B',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  description: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
