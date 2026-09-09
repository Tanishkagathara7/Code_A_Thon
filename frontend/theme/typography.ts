import { Platform, TextStyle } from 'react-native';

const FONT_MEDIUM = 'PlusJakartaSans_500Medium';
const FONT_SEMIBOLD = 'PlusJakartaSans_600SemiBold';
const FONT_BOLD = 'PlusJakartaSans_700Bold';
const FONT_REGULAR = 'PlusJakartaSans_400Regular';

export const Typography = {
  brand: {
    fontFamily: FONT_BOLD,
    fontSize: 23,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  headline: {
    fontFamily: FONT_BOLD,
    fontSize: 33,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
    letterSpacing: -1,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 21,
    letterSpacing: -0.2,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  skip: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  inputLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13.5,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: '#1A1C22',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  inputText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: '#111317',
    letterSpacing: -0.2,
  },
  forgotPassword: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12.5,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: '#3B4054',
    letterSpacing: -0.1,
  },
  buttonPrimary: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  dividerText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12.5,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: '#767B90',
    letterSpacing: -0.1,
  },
  socialButton: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14.5,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: '#15171D',
    letterSpacing: -0.2,
  },
  tabLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13.5,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  cardRadius: 36,
  pillRadius: 999,
  inputRadius: 18,
  buttonRadius: 28,
};
