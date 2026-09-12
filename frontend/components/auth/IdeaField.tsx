import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Stop,
  Circle,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface IdeaFieldProps {
  authMode: 'login' | 'signup';
}

// 10 satellite nodes + 1 central orb
interface NodeDef {
  id: number;
  loginPos: { x: number; y: number }; // Percentage 0..100
  signupPos: { x: number; y: number };
  radius: number;
  baseOpacity: number;
  phaseShift: number;
}

const NODES: NodeDef[] = [
  { id: 1, loginPos: { x: 20, y: 30 }, signupPos: { x: 15, y: 25 }, radius: 6, baseOpacity: 0.85, phaseShift: 0 },
  { id: 2, loginPos: { x: 38, y: 20 }, signupPos: { x: 30, y: 35 }, radius: 7.5, baseOpacity: 0.9, phaseShift: 1.2 },
  { id: 3, loginPos: { x: 68, y: 22 }, signupPos: { x: 72, y: 18 }, radius: 6.5, baseOpacity: 0.8, phaseShift: 2.4 },
  { id: 4, loginPos: { x: 82, y: 40 }, signupPos: { x: 86, y: 48 }, radius: 8, baseOpacity: 0.95, phaseShift: 3.6 },
  { id: 5, loginPos: { x: 75, y: 72 }, signupPos: { x: 68, y: 80 }, radius: 5.5, baseOpacity: 0.7, phaseShift: 4.8 },
  { id: 6, loginPos: { x: 46, y: 82 }, signupPos: { x: 52, y: 75 }, radius: 7, baseOpacity: 0.85, phaseShift: 1.8 },
  { id: 7, loginPos: { x: 22, y: 70 }, signupPos: { x: 28, y: 65 }, radius: 6, baseOpacity: 0.75, phaseShift: 3.1 },
  { id: 8, loginPos: { x: 12, y: 48 }, signupPos: { x: 10, y: 55 }, radius: 5, baseOpacity: 0.65, phaseShift: 4.2 },
  { id: 9, loginPos: { x: 56, y: 34 }, signupPos: { x: 62, y: 30 }, radius: 4.5, baseOpacity: 0.6, phaseShift: 5.1 },
  { id: 10, loginPos: { x: 34, y: 62 }, signupPos: { x: 40, y: 52 }, radius: 5, baseOpacity: 0.7, phaseShift: 0.9 },
];

// Connection edges (fromNodeId -> toNodeId)
const EDGES = [
  { from: 0, to: 1 }, // 0 is central orb
  { from: 0, to: 2 },
  { from: 0, to: 6 },
  { from: 0, to: 10 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
  { from: 8, to: 1 },
];

export const IdeaField: React.FC<IdeaFieldProps> = ({ authMode }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const FIELD_HEIGHT = 200;
  const FIELD_WIDTH = Math.min(SCREEN_WIDTH - 32, 400);

  const isSignup = authMode === 'signup';

  // Mode reconfiguration progress: 0 = login, 1 = signup
  const modeProgress = useSharedValue(isSignup ? 1 : 0);

  // Time clock for gentle floating motion
  const clock = useSharedValue(0);

  // Touch gesture state
  const touchX = useSharedValue(-999);
  const touchY = useSharedValue(-999);
  const touchActive = useSharedValue(0); // 0 = resting, 1 = touching

  useEffect(() => {
    modeProgress.value = withTiming(isSignup ? 1 : 0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [authMode, isSignup]);

  useEffect(() => {
    // Smooth endless clock oscillation
    clock.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // PanResponder to track touch/drag interaction over the field
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          touchX.value = withSpring(locationX, { damping: 15, stiffness: 120 });
          touchY.value = withSpring(locationY, { damping: 15, stiffness: 120 });
          touchActive.value = withTiming(1, { duration: 150 });
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          touchX.value = locationX;
          touchY.value = locationY;
        },
        onPanResponderRelease: () => {
          touchActive.value = withTiming(0, { duration: 400 });
          touchX.value = withTiming(-999, { duration: 400 });
          touchY.value = withTiming(-999, { duration: 400 });
        },
        onPanResponderTerminate: () => {
          touchActive.value = withTiming(0, { duration: 400 });
          touchX.value = withTiming(-999, { duration: 400 });
          touchY.value = withTiming(-999, { duration: 400 });
        },
      }),
    [touchX, touchY, touchActive]
  );

  // Central Orb animated style
  const centerOrbStyle = useAnimatedStyle(() => {
    // Position transitions smoothly between Login (50%, 50%) and Signup (46%, 45%)
    const baseX = interpolate(modeProgress.value, [0, 1], [FIELD_WIDTH * 0.5, FIELD_WIDTH * 0.46]);
    const baseY = interpolate(modeProgress.value, [0, 1], [FIELD_HEIGHT * 0.5, FIELD_HEIGHT * 0.45]);

    // Floating motion
    const floatX = Math.sin(clock.value) * 6;
    const floatY = Math.cos(clock.value * 0.8) * 6;

    // React to touch
    let reactX = 0;
    let reactY = 0;
    if (touchActive.value > 0.01) {
      const dx = touchX.value - baseX;
      const dy = touchY.value - baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const pull = (1 - dist / 120) * 12 * touchActive.value;
        reactX = (dx / dist) * pull;
        reactY = (dy / dist) * pull;
      }
    }

    return {
      transform: [
        { translateX: baseX + floatX + reactX - 32 },
        { translateY: baseY + floatY + reactY - 32 },
      ],
    };
  });

  return (
    <View style={styles.outerContainer} {...panResponder.panHandlers}>
      <View style={[styles.canvasArea, { width: FIELD_WIDTH, height: FIELD_HEIGHT }]}>
        {/* Soft Background Radial Gradient Orbs */}
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Center Gradient Orb */}
            <RadialGradient id="centerOrbGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.85" />
              <Stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.0" />
            </RadialGradient>

            {/* Soft Ambient Background Orbs */}
            <RadialGradient id="bgGlow1" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.0" />
            </RadialGradient>
            <RadialGradient id="bgGlow2" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.0" />
            </RadialGradient>
          </Defs>

          {/* Faint translucent background depth circles */}
          <Circle cx={FIELD_WIDTH * 0.3} cy={FIELD_HEIGHT * 0.4} r={80} fill="url(#bgGlow1)" />
          <Circle cx={FIELD_WIDTH * 0.7} cy={FIELD_HEIGHT * 0.6} r={95} fill="url(#bgGlow2)" />
        </Svg>

        {/* Dynamic Curved SVG Connecting Lines */}
        <Svg style={StyleSheet.absoluteFill}>
          {NODES.map((node, i) => {
            // Calculate SVG curved paths from Central Orb (50%, 50%) to Satellite Node
            const isLoginMode = authMode === 'login';
            const nodePos = isLoginMode ? node.loginPos : node.signupPos;
            const startX = FIELD_WIDTH * 0.5;
            const startY = FIELD_HEIGHT * 0.5;
            const endX = (nodePos.x / 100) * FIELD_WIDTH;
            const endY = (nodePos.y / 100) * FIELD_HEIGHT;

            // Control point for subtle arc curvature
            const midX = (startX + endX) / 2 + (i % 2 === 0 ? 12 : -12);
            const midY = (startY + endY) / 2 + (i % 3 === 0 ? -10 : 10);

            const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

            return (
              <Path
                key={`line-${node.id}`}
                d={pathData}
                stroke={i % 3 === 0 ? '#3B82F6' : '#818CF8'}
                strokeWidth={i % 2 === 0 ? 0.9 : 0.6}
                strokeOpacity={0.28}
                fill="none"
              />
            );
          })}

          {/* Inter-satellite connection paths */}
          {EDGES.slice(4).map((edge, idx) => {
            const n1 = NODES.find((n) => n.id === edge.from);
            const n2 = NODES.find((n) => n.id === edge.to);
            if (!n1 || !n2) return null;

            const isLoginMode = authMode === 'login';
            const pos1 = isLoginMode ? n1.loginPos : n1.signupPos;
            const pos2 = isLoginMode ? n2.loginPos : n2.signupPos;

            const x1 = (pos1.x / 100) * FIELD_WIDTH;
            const y1 = (pos1.y / 100) * FIELD_HEIGHT;
            const x2 = (pos2.x / 100) * FIELD_WIDTH;
            const y2 = (pos2.y / 100) * FIELD_HEIGHT;

            return (
              <Path
                key={`edge-${idx}`}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#C7D2FE"
                strokeWidth={0.5}
                strokeOpacity={0.25}
                fill="none"
              />
            );
          })}
        </Svg>

        {/* Center Gradient Animated Orb */}
        <Animated.View style={[styles.centerOrb, centerOrbStyle]}>
          <Svg width={64} height={64} viewBox="0 0 64 64">
            <Circle cx={32} cy={32} r={32} fill="url(#centerOrbGrad)" />
            <Circle cx={32} cy={32} r={14} fill="#FFFFFF" fillOpacity={0.35} />
            <Circle cx={32} cy={32} r={6} fill="#3B82F6" />
          </Svg>
        </Animated.View>

        {/* Satellite Floating Animated Nodes */}
        {NODES.map((node) => (
          <SingleNodeComponent
            key={node.id}
            node={node}
            fieldWidth={FIELD_WIDTH}
            fieldHeight={FIELD_HEIGHT}
            modeProgress={modeProgress}
            clock={clock}
            touchX={touchX}
            touchY={touchY}
            touchActive={touchActive}
          />
        ))}
      </View>
    </View>
  );
};

interface SingleNodeProps {
  node: NodeDef;
  fieldWidth: number;
  fieldHeight: number;
  modeProgress: SharedValue<number>;
  clock: SharedValue<number>;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  touchActive: SharedValue<number>;
}

const SingleNodeComponent: React.FC<SingleNodeProps> = ({
  node,
  fieldWidth,
  fieldHeight,
  modeProgress,
  clock,
  touchX,
  touchY,
  touchActive,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate base target coordinates between Login and Signup positions
    const loginX = (node.loginPos.x / 100) * fieldWidth;
    const loginY = (node.loginPos.y / 100) * fieldHeight;

    const signupX = (node.signupPos.x / 100) * fieldWidth;
    const signupY = (node.signupPos.y / 100) * fieldHeight;

    const baseX = interpolate(modeProgress.value, [0, 1], [loginX, signupX]);
    const baseY = interpolate(modeProgress.value, [0, 1], [loginY, signupY]);

    // Continuous smooth orbital floating motion using sine/cosine
    const time = clock.value + node.phaseShift;
    const floatX = Math.sin(time) * 5;
    const floatY = Math.cos(time * 1.2) * 5;

    // Interactive touch repulsion / attraction
    let touchOffsetX = 0;
    let touchOffsetY = 0;
    let touchScale = 1;

    if (touchActive.value > 0.01) {
      const dx = touchX.value - (baseX + floatX);
      const dy = touchY.value - (baseY + floatY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 90;

      if (dist < maxDist && dist > 0) {
        // Nearby nodes stretch towards or gently repel touch
        const force = (1 - dist / maxDist) * 16 * touchActive.value;
        touchOffsetX = (dx / dist) * force;
        touchOffsetY = (dy / dist) * force;
        touchScale = 1 + (1 - dist / maxDist) * 0.3;
      }
    }

    // Subtle scale pulsing
    const pulseScale = 1 + Math.sin(time * 2) * 0.08;

    return {
      opacity: node.baseOpacity + Math.sin(time) * 0.1,
      transform: [
        { translateX: baseX + floatX + touchOffsetX - node.radius },
        { translateY: baseY + floatY + touchOffsetY - node.radius },
        { scale: pulseScale * touchScale },
      ],
    };
  });

  const isAccent = node.id % 3 === 0;

  return (
    <Animated.View
      style={[
        styles.nodeDot,
        {
          width: node.radius * 2,
          height: node.radius * 2,
          borderRadius: node.radius,
          backgroundColor: isAccent ? '#3B82F6' : '#818CF8',
          shadowColor: isAccent ? '#3B82F6' : '#818CF8',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.35,
          shadowRadius: 4,
          elevation: 3,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  canvasArea: {
    position: 'relative',
    overflow: 'hidden',
  },
  centerOrb: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 64,
    height: 64,
  },
  nodeDot: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
