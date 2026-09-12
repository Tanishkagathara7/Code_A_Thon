import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  AccessibilityInfo,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { InteractiveBackground } from '../components/onboarding/InteractiveBackground';
import { Scene1Intro } from '../components/onboarding/Scene1Intro';
import { Scene2Creator } from '../components/onboarding/Scene2Creator';
import { Scene5Enter } from '../components/onboarding/Scene5Enter';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Reanimated Shared Values
  const scrollX = useSharedValue(0);
  const touchX = useSharedValue(SCREEN_WIDTH / 2);
  const touchY = useSharedValue(300);
  const isTouching = useSharedValue(false);

  // Check reduced motion accessibility setting
  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (isMounted) setReduceMotion(enabled);
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  // Gesture handler for interactive background touch feedback
  const panGesture = Gesture.Pan()
    .onStart((e) => {
      touchX.value = e.x;
      touchY.value = e.y;
      isTouching.value = true;
    })
    .onUpdate((e) => {
      touchX.value = e.x;
      touchY.value = e.y;
    })
    .onEnd(() => {
      isTouching.value = false;
    })
    .onFinalize(() => {
      isTouching.value = false;
    });

  // Reanimated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < 3) {
      setCurrentIndex(index);
    }
  };

  const navigateToAuth = () => {
    router.replace('/(auth)');
  };

  const handleNext = () => {
    if (currentIndex < 2) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: !reduceMotion,
      });
      setCurrentIndex(nextIndex);
    } else {
      navigateToAuth();
    }
  };

  const isFinalScene = currentIndex === 2;

  // 3 Core Scenes Total
  const SCENES = [
    { id: 'scene-1', component: <Scene1Intro index={0} scrollX={scrollX} /> },
    { id: 'scene-2', component: <Scene2Creator index={1} scrollX={scrollX} /> },
    {
      id: 'scene-3',
      component: (
        <Scene5Enter
          index={2}
          scrollX={scrollX}
          onGetStarted={navigateToAuth}
          onLoginPress={navigateToAuth}
        />
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />

      <GestureDetector gesture={panGesture}>
        <View style={styles.root}>
          {/* Interactive Light-Theme Atmospheric Background */}
          <InteractiveBackground
            scrollX={scrollX}
            touchX={touchX}
            touchY={touchY}
            isTouching={isTouching}
          />

          <SafeAreaView style={styles.safeArea}>
            {/* Top Editorial Header Row: Safe Area Inset Protection & Light-Theme Matching SKIP Pill */}
            <View style={[styles.headerRow, { paddingTop: Math.max(insets.top + 8, 20) }]}>
              {/* Spacer on left */}
              <View style={styles.headerSpacer} />

              {/* Light-theme matching subtle capsule SKIP button */}
              {!isFinalScene && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={navigateToAuth}
                  style={styles.skipLightPillButton}
                  accessibilityLabel="Skip onboarding"
                  accessibilityRole="button"
                >
                  <Text style={styles.skipLightPillText}>SKIP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Horizontal Paging Scenes (3 total) */}
            <Animated.FlatList
              ref={flatListRef}
              data={SCENES}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleScrollEnd}
              renderItem={({ item }) => item.component}
              style={styles.flatList}
            />

            {/* Bottom Editorial Control Bar */}
            <View style={styles.bottomBar}>
              {/* Minimal Progress Indicator Lines (3 segments) */}
              <View style={styles.progressRow}>
                {[0, 1, 2].map((i) => {
                  const isActive = currentIndex === i;
                  return (
                    <View
                      key={`progress-${i}`}
                      style={[
                        styles.progressSegment,
                        isActive ? styles.progressSegmentActive : styles.progressSegmentInactive,
                      ]}
                    />
                  );
                })}
              </View>

              {/* Next Button for Scenes 1 & 2 */}
              {!isFinalScene && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleNext}
                  style={styles.nextButton}
                  accessibilityRole="button"
                  accessibilityLabel="Next slide"
                >
                  <Text style={styles.nextText}>Next</Text>
                  <Text style={styles.nextArrow}>→</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 6,
    zIndex: 20,
  },
  headerSpacer: {
    width: 20,
  },
  skipLightPillButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
  },
  skipLightPillText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  flatList: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
    paddingTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    height: 3,
    borderRadius: 1.5,
  },
  progressSegmentActive: {
    width: 28,
    backgroundColor: '#0F172A',
  },
  progressSegmentInactive: {
    width: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  nextArrow: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
