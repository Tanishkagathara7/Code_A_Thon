import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeInDown,
  FadeIn,
  LinearTransition,
} from 'react-native-reanimated';

import { VisualElement } from './VisualElement';
import { AuthHeader } from './AuthHeader';
import { AuthHero, AuthMode } from './AuthHero';
import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';
import { SocialButton } from './SocialButton';
import { Divider } from './Divider';
import { AuthFooter } from './AuthFooter';
import { MailIcon, KeyIcon, UserIcon } from '../icons/Icons';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { useAuth } from '../../context/AuthContext';
import { DefaultTheme, AppTheme } from '../../theme/config';
import { useRouter } from 'expo-router';

interface AuthScreenProps {
  theme?: AppTheme;
  onGuestPress?: () => void;
}

// ─── Validation helpers ────────────────────────────────────────────────────
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const validateLogin = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

const validateSignup = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 8)
    errors.password = 'Password must be at least 8 characters';
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  return errors;
};
// ──────────────────────────────────────────────────────────────────────────

export const AuthScreen: React.FC<AuthScreenProps> = ({
  theme = DefaultTheme,
  onGuestPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loginWithEmail, signupWithEmail, loginWithGoogle, loginWithGitHub } =
    useAuth();

  // Redirect if already authenticated (Single source of truth for auth navigation)
  React.useEffect(() => {
    if (user) {
      const t7 = Date.now();
      console.log(`[TIMING] T7: Navigation starts at ${t7}`);
      router.replace('/home');
    }
  }, [user, router]);

  // ─── Mode ─────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<AuthMode>('login');

  // ─── Form state ───────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  // ─── UI state ─────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [banner, setBanner] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // ─── Field-level errors ───────────────────────────────────────────────
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [signupErrors, setSignupErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleModeChange = (next: AuthMode) => {
    Keyboard.dismiss();
    setMode(next);
    setBanner(null);
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleSubmit = useCallback(async () => {
    setBanner(null);
    if (mode === 'login') {
      const errs = validateLogin(loginEmail, loginPassword);
      if (Object.keys(errs).length) {
        setLoginErrors(errs);
        return;
      }
      setLoginErrors({});
      setLoading(true);
      try {
        await loginWithEmail(loginEmail, loginPassword);
      } catch (err: any) {
        setBanner({ type: 'error', text: err?.message || 'Sign in failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else if (mode === 'signup') {
      const errs = validateSignup(signupName, signupEmail, signupPassword, signupConfirm);
      if (Object.keys(errs).length) {
        setSignupErrors(errs);
        return;
      }
      setSignupErrors({});
      setLoading(true);
      try {
        await signupWithEmail(signupName, signupEmail, signupPassword);
      } catch (err: any) {
        setBanner({ type: 'error', text: err?.message || 'Sign up failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  }, [
    mode,
    loginEmail,
    loginPassword,
    signupName,
    signupEmail,
    signupPassword,
    signupConfirm,
    loginWithEmail,
    signupWithEmail,
  ]);

  const handleGoogle = async () => {
    const t1 = Date.now();
    console.log(`[TIMING] T1: Google button pressed at ${t1}`);
    setBanner(null);
    setSocialLoading('google');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.message !== 'CANCELLED') {
        setBanner({ type: 'error', text: err?.message || 'Google sign in failed.' });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGitHub = async () => {
    setBanner(null);
    setSocialLoading('github');
    try {
      await loginWithGitHub();
    } catch (err: any) {
      if (err?.message !== 'CANCELLED') {
        setBanner({ type: 'error', text: err?.message || 'GitHub sign in failed.' });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // ─── Derived UI content ───────────────────────────────────────────────
  const submitLabel =
    mode === 'login' ? 'Sign in' : 'Create account';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />

      {/* Subtle geometric visual depth element behind top area */}
      <VisualElement />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── TOP HEADER ── */}
            <Animated.View entering={FadeIn.duration(400).delay(0)}>
              <AuthHeader
                theme={theme}
                onGuestPress={onGuestPress}
              />
            </Animated.View>

            {/* ── HERO ── */}
            <Animated.View entering={FadeInDown.duration(350).delay(60)}>
              <AuthHero mode={mode} theme={theme} />
            </Animated.View>

            {/* ── FORM BODY ── */}
            <View style={styles.formArea}>

              {/* Status Banner */}
              {banner && (
                <Animated.View
                  entering={FadeInDown.duration(200)}
                  style={[
                    styles.banner,
                    {
                      backgroundColor:
                        banner.type === 'error'
                          ? theme.colors.errorBg
                          : theme.colors.successBg,
                      borderColor:
                        banner.type === 'error'
                          ? theme.colors.error
                          : theme.colors.success,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bannerText,
                      {
                        color:
                          banner.type === 'error'
                            ? theme.colors.error
                            : theme.colors.success,
                      },
                    ]}
                  >
                    {banner.text}
                  </Text>
                </Animated.View>
              )}

              {/* ── LOGIN FIELDS ── */}
              {mode === 'login' && (
                <Animated.View
                  key="login-fields"
                  entering={FadeInDown.duration(300).delay(80)}
                  layout={LinearTransition.springify()}
                >
                  <InputField
                    label="Email"
                    value={loginEmail}
                    onChangeText={(v) => {
                      setLoginEmail(v);
                      if (loginErrors.email) setLoginErrors((e) => ({ ...e, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    icon={<MailIcon size={17} color={theme.colors.mutedText} />}
                    error={loginErrors.email}
                    theme={theme}
                  />
                  <InputField
                    label="Password"
                    value={loginPassword}
                    onChangeText={(v) => {
                      setLoginPassword(v);
                      if (loginErrors.password) setLoginErrors((e) => ({ ...e, password: undefined }));
                    }}
                    placeholder="••••••••••••"
                    isPassword
                    autoComplete="password"
                    textContentType="password"
                    icon={<KeyIcon size={17} color={theme.colors.mutedText} />}
                    error={loginErrors.password}
                    theme={theme}
                  />

                  {/* Forgot password link */}
                  <TouchableOpacity
                    onPress={() => setForgotVisible(true)}
                    activeOpacity={0.7}
                    style={styles.forgotRow}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.forgotText, { color: theme.colors.mutedText }]}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* ── SIGNUP FIELDS ── */}
              {mode === 'signup' && (
                <Animated.View
                  key="signup-fields"
                  entering={FadeInDown.duration(300).delay(80)}
                  layout={LinearTransition.springify()}
                >
                  <InputField
                    label="Name"
                    value={signupName}
                    onChangeText={(v) => {
                      setSignupName(v);
                      if (signupErrors.name) setSignupErrors((e) => ({ ...e, name: undefined }));
                    }}
                    placeholder="Your full name"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    icon={<UserIcon size={17} color={theme.colors.mutedText} />}
                    error={signupErrors.name}
                    theme={theme}
                  />
                  <InputField
                    label="Email"
                    value={signupEmail}
                    onChangeText={(v) => {
                      setSignupEmail(v);
                      if (signupErrors.email) setSignupErrors((e) => ({ ...e, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    icon={<MailIcon size={17} color={theme.colors.mutedText} />}
                    error={signupErrors.email}
                    theme={theme}
                  />
                  <InputField
                    label="Password"
                    value={signupPassword}
                    onChangeText={(v) => {
                      setSignupPassword(v);
                      if (signupErrors.password) setSignupErrors((e) => ({ ...e, password: undefined }));
                    }}
                    placeholder="Min. 8 characters"
                    isPassword
                    autoComplete="new-password"
                    textContentType="newPassword"
                    icon={<KeyIcon size={17} color={theme.colors.mutedText} />}
                    error={signupErrors.password}
                    theme={theme}
                  />
                  <InputField
                    label="Confirm password"
                    value={signupConfirm}
                    onChangeText={(v) => {
                      setSignupConfirm(v);
                      if (signupErrors.confirmPassword) setSignupErrors((e) => ({ ...e, confirmPassword: undefined }));
                    }}
                    placeholder="Re-enter password"
                    isPassword
                    autoComplete="new-password"
                    textContentType="newPassword"
                    icon={<KeyIcon size={17} color={theme.colors.mutedText} />}
                    error={signupErrors.confirmPassword}
                    theme={theme}
                  />
                </Animated.View>
              )}

              {/* ── PRIMARY CTA ── */}
              <Animated.View
                entering={FadeInDown.duration(300).delay(140)}
                layout={LinearTransition.springify()}
              >
                <PrimaryButton
                  title={submitLabel}
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || !!socialLoading}
                  theme={theme}
                />
              </Animated.View>

              {/* ── SOCIAL AUTH ── */}
              <Animated.View
                entering={FadeInDown.duration(300).delay(180)}
                layout={LinearTransition.springify()}
              >
                <Divider theme={theme} />
                <SocialButton
                  onGooglePress={handleGoogle}
                  onGitHubPress={handleGitHub}
                  googleLoading={socialLoading === 'google'}
                  gitHubLoading={socialLoading === 'github'}
                  theme={theme}
                />
              </Animated.View>

              {/* ── FOOTER SWITCH ── */}
              <Animated.View
                entering={FadeInDown.duration(300).delay(220)}
              >
                <AuthFooter
                  mode={mode}
                  onModeChange={handleModeChange}
                  theme={theme}
                />
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <ForgotPasswordModal
        visible={forgotVisible}
        onClose={() => setForgotVisible(false)}
        defaultEmail={loginEmail}
        onSuccessMessage={(msg) => {
          setForgotVisible(false);
          setBanner({ type: 'success', text: msg });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  formArea: {
    paddingHorizontal: 24,
    paddingTop: 4,
    flex: 1,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 14,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  banner: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  bannerText: {
    fontSize: 13.5,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 19,
  },
});
