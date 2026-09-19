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
    background: '#F8F9FC',      // Web clean canvas background
    surface: '#FFFFFF',         // Crisp white card background
    surfaceHover: '#F1F3F9',    // Subtle interactive state
    text: '#101226',            // High-contrast primary brand text
    mutedText: '#68728A',       // Neutral 500 body text
    subtleText: '#94A3B8',      // Neutral 400 helper text
    border: '#E6E9F0',          // Subtle light border matching web
    borderFocus: '#5B45F5',     // Focused border ring with brand purple
    accent: '#5B45F5',          // Pulse brand purple accent
    accentText: '#FFFFFF',
    error: '#EF4444',
    errorBg: '#FEE2E2',
    success: '#16B981',
    successBg: '#DCFCE7',
    socialBg: '#FFFFFF',
    socialBorder: '#E6E9F0',
    socialText: '#101226',
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
