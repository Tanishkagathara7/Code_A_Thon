export interface AppTheme {
  appName: string;
  logoText?: string;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    mutedText: string;
    subtleText: string;
    border: string;
    borderFocus: string;
    accent: string;
    accentText: string;
    error: string;
    errorBg: string;
    success: string;
    successBg: string;
    socialBg: string;
    socialBorder: string;
    socialText: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  animationDuration: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export const DefaultTheme: AppTheme = {
  appName: 'App',
  logoText: 'APP',
  colors: {
    background: '#FAF9F8',      // Warm off-white base
    surface: '#FFFFFF',         // Pristine card/input background
    surfaceHover: '#F4F4F5',    // Subtle hover state
    text: '#09090B',            // Near-black high-contrast primary text
    mutedText: '#71717A',       // Neutral 500 body muted text
    subtleText: '#A1A1AA',      // Neutral 400 helper text
    border: '#E4E4E7',          // Subtle light border
    borderFocus: '#18181B',     // Focused dark border ring
    accent: '#18181B',          // Sophisticated near-black primary accent
    accentText: '#FFFFFF',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    success: '#16A34A',
    successBg: '#DCFCE7',
    socialBg: '#FFFFFF',
    socialBorder: '#E4E4E7',
    socialText: '#09090B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radii: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  animationDuration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};
