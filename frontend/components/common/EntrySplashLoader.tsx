import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface EntrySplashLoaderProps {
  subtitle?: string;
  onFinished?: () => void;
  postAnimationHoldMs?: number; // Time to hold screen on final brand logo frame
}

export const EntrySplashLoader: React.FC<EntrySplashLoaderProps> = ({
  subtitle = 'CODE-A-THON',
  onFinished,
  postAnimationHoldMs = 2000, // Hold for 2 seconds so user clearly sees the logo
}) => {
  const { width, height } = useWindowDimensions();
  const [hasFinished, setHasFinished] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Initialize expo-video player with local asset
  const player = useVideoPlayer(require('../../assets/Scene-1.mp4'), (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });

  const triggerCompletion = () => {
    if (!hasFinished) {
      setHasFinished(true);
      if (onFinished) {
        onFinished();
      }
    }
  };

  useEffect(() => {
    if (!player) return;

    // Detect when video actually begins playback
    const playingSub = player.addListener('playingChange', (payload) => {
      if (payload.isPlaying) {
        setVideoStarted(true);
        // Hide splash screen immediately when video playback begins
        SplashScreen.hideAsync().catch(() => {});
      }
    });

    const endSub = player.addListener('playToEnd', () => {
      setVideoEnded(true);
      try {
        player.pause();
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        triggerCompletion();
      }, postAnimationHoldMs);
    });

    return () => {
      playingSub.remove();
      endSub.remove();
    };
  }, [player, postAnimationHoldMs]);

  return (
    <View style={styles.container}>
      {/* 
        VideoView with contentFit="contain" at natural 1.0 scale:
        Guarantees the full "CODE-A-THON" artwork, side tags, and borders
        are 100% visible on all mobile screens without any edge clipping.
      */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
      />

      {/* 
        Skip Button overlay:
        Only show AFTER the video has actually started playing (no white pre-flash screen with skip button).
      */}
      {onFinished && videoStarted && !videoEnded && (
        <Animated.View
          entering={FadeIn.delay(600).duration(300)}
          exiting={FadeOut.duration(200)}
          style={styles.skipContainer}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={triggerCompletion}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '96%',
    height: '100%',
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    right: 24,
    zIndex: 99,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export default EntrySplashLoader;
