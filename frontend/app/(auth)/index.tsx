import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { AnimatedAtmosphere } from '../../components/auth/AnimatedAtmosphere';
import { HeaderSection } from '../../components/auth/HeaderSection';
import { SegmentedControl } from '../../components/auth/SegmentedControl';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthInput } from '../../components/auth/AuthInput';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButton';
import { AuthDivider } from '../../components/auth/AuthDivider';
import { MailIcon, KeyIcon, UserIcon } from '../../components/icons/Icons';
import { Typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';

export default function AuthScreen() {
  const router = useRouter();
  const { user, loginWithEmail, signupWithEmail, loginWithGoogle, loginWithGitHub } =
    useAuth();

  React.useEffect(() => {
    if (user) {
      console.log('[AUTH] AuthScreen mounted with active user session, replacing with /home');
      router.replace('/home');
    }
  }, [user, router]);

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Dedicated independent form states for Login and Sign Up
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Interactive feedback
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(
    null
  );
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    setStatusMessage(null);
    setLoading(true);
    try {
      if (authMode === 'login') {
        if (!loginEmail || !loginPassword) {
          setStatusMessage({
            type: 'error',
            text: 'Please enter your email and password.',
          });
          setLoading(false);
          return;
        }
        await loginWithEmail(loginEmail, loginPassword);
      } else {
        if (!signupUsername || !signupEmail || !signupPassword) {
          setStatusMessage({
            type: 'error',
            text: 'Please fill in username, email, and password.',
          });
          setLoading(false);
          return;
        }

        if (signupPassword.length < 8) {
          setStatusMessage({
            type: 'error',
            text: 'Password must be at least 8 characters long.',
          });
          setLoading(false);
          return;
        }

        if (
          !/[A-Z]/.test(signupPassword) ||
          !/[a-z]/.test(signupPassword) ||
          !/[0-9]/.test(signupPassword) ||
          !/[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/~`]/.test(signupPassword)
        ) {
          setStatusMessage({
            type: 'error',
            text: 'Password must include uppercase, lowercase, number, and a special character (!@#$...).',
          });
          setLoading(false);
          return;
        }

        await signupWithEmail(signupUsername, signupEmail, signupPassword);
      }
      router.replace('/home');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Authentication failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setStatusMessage(null);
    setSocialLoading('google');
    try {
      await loginWithGoogle();
      router.replace('/home');
    } catch (err: any) {
      if (err?.message !== 'CANCELLED') {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Google Sign In could not be completed.',
        });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGitHub = async () => {
    setStatusMessage(null);
    setSocialLoading('github');
    try {
      await loginWithGitHub();
      router.replace('/home');
    } catch (err: any) {
      if (err?.message !== 'CANCELLED') {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'GitHub Sign In could not be completed.',
        });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleForgotPassword = () => {
    setStatusMessage(null);
    setForgotPasswordVisible(true);
  };

  const handleSkip = () => {
    router.replace('/home');
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: authMode === 'login' ? '#1E274A' : '#0F3832' },
      ]}
    >
      <StatusBar style="light" />

      {/* Atmospheric dynamic animated background */}
      <AnimatedAtmosphere authMode={authMode} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section: MindBloom, Skip pill, Title & Subtitle */}
            <HeaderSection authMode={authMode} onSkip={handleSkip} />

            {/* Spacer pushing the AuthCard nicely toward bottom or center */}
            <View style={styles.spacer} />

            {/* White tactile Auth Card */}
            <AuthCard>
              {/* Segmented Control: Log in <-> Sign up */}
              <SegmentedControl
                authMode={authMode}
                onChangeMode={(mode) => {
                  Keyboard.dismiss();
                  setAuthMode(mode);
                  setStatusMessage(null);
                }}
              />

              {/* Status Banner */}
              {statusMessage && (
                <Animated.View
                  entering={FadeInDown.duration(200)}
                  exiting={FadeOut.duration(150)}
                  style={[
                    styles.statusBanner,
                    statusMessage.type === 'error'
                      ? styles.statusError
                      : styles.statusSuccess,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      statusMessage.type === 'error'
                        ? styles.statusTextError
                        : styles.statusTextSuccess,
                    ]}
                  >
                    {statusMessage.text}
                  </Text>
                </Animated.View>
              )}

              {/* Dynamic Form Inputs with smooth entry animations */}
              <Animated.View layout={Layout.springify()}>
                {authMode === 'signup' ? (
                  <View key="signup-form">
                    <Animated.View
                      entering={FadeInDown.duration(240)}
                      exiting={FadeOut.duration(180)}
                    >
                      <AuthInput
                        key="signup-username"
                        label="Username"
                        value={signupUsername}
                        onChangeText={setSignupUsername}
                        placeholder="Enter your username"
                        icon={<UserIcon size={19} color="#72778E" />}
                        autoCapitalize="none"
                        authMode={authMode}
                      />
                    </Animated.View>

                    <Animated.View entering={FadeIn.duration(200)}>
                      <AuthInput
                        key="signup-email"
                        label="Email"
                        value={signupEmail}
                        onChangeText={setSignupEmail}
                        placeholder="Enter your email"
                        icon={<MailIcon size={19} color="#72778E" />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        authMode={authMode}
                        autoComplete="email"
                        textContentType="emailAddress"
                      />
                    </Animated.View>

                    <Animated.View entering={FadeIn.duration(200)}>
                      <AuthInput
                        key="signup-password"
                        label="Password"
                        value={signupPassword}
                        onChangeText={setSignupPassword}
                        placeholder="Enter your password (min 8 chars, 1 special)"
                        icon={<KeyIcon size={19} color="#72778E" />}
                        isPassword
                        authMode={authMode}
                        autoComplete="new-password"
                        textContentType="newPassword"
                      />
                    </Animated.View>
                  </View>
                ) : (
                  <View key="login-form">
                    <Animated.View entering={FadeIn.duration(200)}>
                      <AuthInput
                        key="login-email"
                        label="Email"
                        value={loginEmail}
                        onChangeText={setLoginEmail}
                        placeholder="Enter your email"
                        icon={<MailIcon size={19} color="#72778E" />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        authMode={authMode}
                        autoComplete="email"
                        textContentType="emailAddress"
                      />
                    </Animated.View>

                    <Animated.View entering={FadeIn.duration(200)}>
                      <AuthInput
                        key="login-password"
                        label="Password"
                        value={loginPassword}
                        onChangeText={setLoginPassword}
                        placeholder="Enter your password"
                        icon={<KeyIcon size={19} color="#72778E" />}
                        isPassword
                        authMode={authMode}
                        autoComplete="password"
                        textContentType="password"
                      />
                    </Animated.View>
                  </View>
                )}

                {/* Forgot Password link (Login mode only) */}
                {authMode === 'login' && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.forgotPasswordContainer}
                  >
                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                    >
                      <Text style={Typography.forgotPassword}>
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {/* Primary Action Button (Log in / Sign up) */}
                <View style={styles.primaryButtonWrapper}>
                  <PrimaryButton
                    title={authMode === 'login' ? 'Log in' : 'Sign up'}
                    onPress={handleSubmit}
                    loading={loading}
                  />
                </View>

                {/* Or log in with / Or sign up with divider */}
                <AuthDivider authMode={authMode} />

                {/* GitHub & Google tactile Social Buttons */}
                <SocialAuthButtons
                  onGitHubPress={handleGitHub}
                  onGooglePress={handleGoogle}
                  gitHubLoading={socialLoading === 'github'}
                  googleLoading={socialLoading === 'google'}
                />
              </Animated.View>
            </AuthCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Interactive Forgot Password Modal */}
      <ForgotPasswordModal
        visible={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
        defaultEmail={loginEmail}
        onSuccessMessage={(msg) => {
          setStatusMessage({
            type: 'success',
            text: msg,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1E274A',
  },
  flexOne: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  spacer: {
    minHeight: 12,
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 20,
  },
  primaryButtonWrapper: {
    marginTop: 6,
  },
  statusBanner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  statusError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusTextError: {
    color: '#B91C1C',
  },
  statusTextSuccess: {
    color: '#15803D',
  },
});
