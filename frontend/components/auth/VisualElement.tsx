import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient as SvgRadial, LinearGradient as SvgLinear, Stop, Rect, Circle } from 'react-native-svg';

export const VisualElement: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={styles.container}>
      <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Subtle Top Ambient Radial Gradient */}
          <SvgRadial id="topAmbient" cx="50%" cy="20%" r="60%">
            <Stop offset="0%" stopColor="#18181B" stopOpacity="0.04" />
            <Stop offset="50%" stopColor="#A1A1AA" stopOpacity="0.02" />
            <Stop offset="100%" stopColor="#FAF9F8" stopOpacity="0.0" />
          </SvgRadial>

          {/* Precision Architectural Grid Lines */}
          <SvgLinear id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#E4E4E7" stopOpacity="0.0" />
            <Stop offset="50%" stopColor="#E4E4E7" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.0" />
          </SvgLinear>
        </Defs>

        {/* Top Subtle Soft Gradient Orb */}
        <Circle cx={width * 0.5} cy={30} r={120} fill="url(#topAmbient)" />

        {/* Minimal Precision Grid Accent Lines */}
        <Rect x={width * 0.1} y={45} width={width * 0.8} height={1} fill="url(#lineGrad)" />
        <Rect x={width * 0.2} y={115} width={width * 0.6} height={1} fill="url(#lineGrad)" opacity={0.6} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    overflow: 'hidden',
  },
});
