import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { AuthHeroVisual } from './AuthHeroVisual';

interface HeaderSectionProps {
  authMode: 'login' | 'signup';
  onSkip?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ authMode, onSkip }) => {
  const isLogin = authMode === 'login';

  return (
    <View style={styles.container}>
      {/* Brand Header Row: Butterfly Logo + MindBloom + Guest Login Button */}
      <View style={styles.brandRow}>
        <View style={styles.brandTitleWrapper}>
          {/* Luminous Butterfly/Bloom Gradient Logo */}
          <Svg width={28} height={28} viewBox="0 0 32 32" fill="none">
            <Defs>
              <SvgGradient id="logoGrad1" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#818CF8" />
                <Stop offset="100%" stopColor="#3B82F6" />
              </SvgGradient>
              <SvgGradient id="logoGrad2" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#C084FC" />
                <Stop offset="100%" stopColor="#6366F1" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 16 16 C 10 10 4 10 4 16 C 4 22 10 22 16 16 Z"
              fill="url(#logoGrad1)"
            />
            <Path
              d="M 16 16 C 22 10 28 10 28 16 C 28 22 22 22 16 16 Z"
              fill="url(#logoGrad2)"
              opacity="0.85"
            />
            <Path
              d="M 16 16 C 10 22 10 28 16 28 C 22 28 22 22 16 16 Z"
              fill="url(#logoGrad1)"
              opacity="0.7"
            />
            <Path
              d="M 16 16 C 10 10 10 4 16 4 C 22 4 22 10 16 16 Z"
              fill="url(#logoGrad2)"
              opacity="0.9"
            />
          </Svg>

          <View style={styles.brandTextGroup}>
            <Text style={styles.brandName}>MindBloom</Text>
            <Text style={styles.brandTagline}>IDEAS  •  PEOPLE  •  IMPACT</Text>
          </View>
        </View>

        {/* Guest Login Action Pill */}
        {onSkip && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onSkip}
            style={styles.guestLoginButton}
            accessibilityLabel="Guest Login"
            accessibilityRole="button"
          >
            <Text style={styles.guestLoginText}>Guest Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hero Section: Editorial Title on Left + Architectural Arch Visual on Right */}
      <View style={styles.heroRow}>
        <View style={styles.heroTextContainer}>
          {isLogin ? (
            <>
              <Text style={styles.heroTitleMain}>Welcome</Text>
              <Text style={styles.heroTitleAccent}>Back</Text>
              <Text style={styles.heroSubtitle}>
                Log in to continue your journey and turn ideas into reality.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitleMain}>Create</Text>
              <Text style={styles.heroTitleAccent}>Something New</Text>
              <Text style={styles.heroSubtitle}>
                Start your journey and bring your ideas to life.
              </Text>
            </>
          )}
        </View>

        {/* Architectural Arch Visual Frame */}
        <AuthHeroVisual />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextGroup: {
    gap: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  guestLoginButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)',
  },
  guestLoginText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 6,
  },
  heroTitleMain: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  heroTitleAccent: {
    fontSize: 34,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: -1.2,
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#64748B',
    letterSpacing: -0.2,
    lineHeight: 19,
    maxWidth: 220,
  },
});
