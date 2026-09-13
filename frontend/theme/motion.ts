import { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const MotionDurations = {
  fast: 150,
  standard: 250,
  emphasis: 400,
};

export const MotionTimingConfigs: Record<'fast' | 'standard' | 'emphasis', WithTimingConfig> = {
  fast: { duration: MotionDurations.fast },
  standard: { duration: MotionDurations.standard },
  emphasis: { duration: MotionDurations.emphasis },
};

export const MotionSpringConfigs: Record<'gentle' | 'bouncy' | 'snappy', WithSpringConfig> = {
  gentle: { damping: 20, stiffness: 180, mass: 1 },
  bouncy: { damping: 12, stiffness: 200, mass: 0.8 },
  snappy: { damping: 24, stiffness: 300, mass: 0.8 },
};

export const ScalePresets = {
  press: 0.96,
  hover: 1.02,
};
