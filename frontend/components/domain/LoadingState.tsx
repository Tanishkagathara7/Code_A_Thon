import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading items...',
  count = 3,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerIndicator}>
        <ActivityIndicator size="small" color="#18181B" />
        <Text style={styles.message}>{message}</Text>
      </View>

      {Array.from({ length: count }).map((_, index) => (
        <Animated.View key={index} style={[styles.skeletonCard, animatedStyle]}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonBadge} />
          </View>
          <View style={styles.skeletonBodyLine1} />
          <View style={styles.skeletonBodyLine2} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  message: {
    fontSize: 13.5,
    color: '#71717A',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonTitle: {
    width: '45%',
    height: 16,
    backgroundColor: '#E4E4E7',
    borderRadius: 6,
  },
  skeletonBadge: {
    width: '20%',
    height: 16,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  skeletonBodyLine1: {
    width: '90%',
    height: 12,
    backgroundColor: '#F4F4F5',
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonBodyLine2: {
    width: '60%',
    height: 12,
    backgroundColor: '#F4F4F5',
    borderRadius: 4,
  },
});

