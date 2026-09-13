import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, Animated, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetwork } from '../../context/NetworkContext';

export const NetworkStatusBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isOffline, status } = useNetwork();
  
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerMode, setBannerMode] = useState<'offline' | 'online'>('offline');
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const prevOfflineRef = useRef<boolean>(false);
  const hideTimerRef = useRef<any>(null);

  useEffect(() => {
    // Transition logic:
    // If state changes from online -> offline: show offline banner
    // If state changes from offline -> online: show "Back online" for 2.5s, then hide
    if (isOffline) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setBannerMode('offline');
      setShowBanner(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else if (prevOfflineRef.current && !isOffline) {
      // Just came back online
      setBannerMode('online');
      setShowBanner(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      hideTimerRef.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }).start(() => {
          setShowBanner(false);
        });
      }, 2500);
    }

    prevOfflineRef.current = isOffline;
  }, [isOffline]);

  if (!showBanner) return null;

  const isOfflineMode = bannerMode === 'offline';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 8) + 4,
          transform: [{ translateY }],
          backgroundColor: isOfflineMode ? '#1E2433' : '#10B981',
          borderColor: isOfflineMode ? '#374151' : '#059669',
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isOfflineMode ? '#F59E0B' : '#FFFFFF' },
          ]}
        />
        <Text style={styles.text}>
          {isOfflineMode
            ? "You're offline • Showing cached or offline view"
            : 'Back online • Connection restored'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
