import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const AuthBackground: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Warm Ivory Base Screen Canvas */}
      <View style={styles.baseCanvas} />

      {/* Faint Pastel Lavender Radial Shape (Top-Right) */}
      <View
        style={[
          styles.ambientOrb,
          {
            width: width * 1.3,
            height: width * 1.3,
            top: -width * 0.35,
            right: -width * 0.3,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(238, 242, 255, 0.75)', 'rgba(243, 244, 255, 0.3)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.2, y: 1 }}
        />
      </View>

      {/* Faint Soft Blue Form (Middle-Left) */}
      <View
        style={[
          styles.ambientOrb,
          {
            width: width * 1.1,
            height: width * 1.1,
            top: width * 0.3,
            left: -width * 0.4,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(224, 242, 254, 0.5)', 'rgba(238, 242, 255, 0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.3, y: 0.5 }}
          end={{ x: 0.9, y: 0.8 }}
        />
      </View>

      {/* Soft Warm Bottom Glow */}
      <View
        style={[
          styles.ambientOrb,
          {
            width: width * 1.2,
            height: width * 1.2,
            bottom: -width * 0.3,
            right: -width * 0.2,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(254, 243, 199, 0.25)', 'rgba(243, 232, 255, 0.25)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.6, y: 0.8 }}
          end={{ x: 0.2, y: 0.2 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  baseCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FAF9F6', // Warm off-white / light ivory
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
});
