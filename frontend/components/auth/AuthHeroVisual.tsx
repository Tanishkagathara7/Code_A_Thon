import React from 'react';
import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';

export const AuthHeroVisual: React.FC = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  // Responsive sizing: approx 28–32% screen width, capped at max 140px width & 180px height
  const imageWidth = Math.min(SCREEN_WIDTH * 0.32, 135);
  const imageHeight = imageWidth * 1.35;

  return (
    <View style={[styles.container, { width: imageWidth, height: imageHeight }]}>
      {/* Real Standalone Window Artwork Asset */}
      <Image
        source={require('../../assets/hero-window.png')}
        style={styles.windowImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  windowImage: {
    width: '100%',
    height: '100%',
  },
});
