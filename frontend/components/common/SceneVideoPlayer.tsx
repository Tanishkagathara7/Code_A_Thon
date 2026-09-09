import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SceneVideoPlayerProps {
  onAnimationEnd?: () => void;
  showSkipButton?: boolean;
  loop?: boolean;
}

export const SceneVideoPlayer: React.FC<SceneVideoPlayerProps> = ({
  onAnimationEnd,
  showSkipButton = true,
  loop = false,
}) => {
  const [hasEnded, setHasEnded] = useState(false);

  const player = useVideoPlayer(require('../../assets/Scene-1.mp4'), (p) => {
    p.loop = loop;
    p.muted = true;
    p.play();
  });

  const handleFinish = () => {
    if (!hasEnded) {
      setHasEnded(true);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }
  };

  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('playToEnd', () => {
      if (!loop) {
        handleFinish();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, loop]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      {showSkipButton && onAnimationEnd && (
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.skipContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFinish}
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
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    right: 24,
    zIndex: 1000,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
export default SceneVideoPlayer;
