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
  appName: 'GST Billing',
  logoText: 'GST Billing',
  colors: {
    background: '#F7F5EF',      // Warm neutral paper canvas
    surface: '#FFFDF8',         // Warm card background
    surfaceHover: '#F4F7FB',    // Soft blue interactive tint
    text: '#0A0A0A',            // Primary deep legible ink
    mutedText: '#525866',       // Secondary slate neutral grey
    subtleText: '#868C98',      // Subtle helper text
    border: '#E2E4E9',          // Hairline warm subtle border
    borderFocus: '#0A0A0A',     // High-contrast ink border ring
    accent: '#0A0A0A',          // Deep structural ink accent
    accentText: '#FFFFFF',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    success: '#16A34A',
    successBg: '#F1F8F2',       // Soft mint tint
    socialBg: '#FFFFFF',
    socialBorder: '#E2E4E9',
    socialText: '#0A0A0A',
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
