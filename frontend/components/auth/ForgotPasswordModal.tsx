import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';
import { MailIcon, KeyIcon } from '../icons/Icons';
import { Typography, Spacing } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccessMessage: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  defaultEmail = '',
  onSuccessMessage,
}) => {
  const { requestPasswordReset, resetPassword } = useAuth();

  // Step 1: 'email' (request OTP), Step 2: 'reset' (enter OTP and new password)
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Sync initial email whenever opened
  React.useEffect(() => {
    if (visible) {
      if (defaultEmail) setEmail(defaultEmail);
      setStep('email');
      setOtp('');
      setNewPassword('');
      setErrorMsg(null);
      setSuccessInfo(null);
    }
  }, [visible, defaultEmail]);

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setSuccessInfo(res.message || `Verification code has been sent to ${email.trim()}`);
      if (res.otp) {
        setOtp(res.otp);
      }
      setStep('reset');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to request reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/~`]/.test(newPassword)
    ) {
      setErrorMsg('Password must include uppercase, lowercase, number, and special character (!@#$...).');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await resetPassword(email.trim(), otp.trim(), newPassword);
      onClose();
      onSuccessMessage('Password reset successfully! You can now log in.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.container}
            >
              <Animated.View entering={ZoomIn.duration(200)} style={styles.dialogCard}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  <Text style={styles.title}>
                    {step === 'email' ? 'Reset Password' : 'New Password'}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    accessibilityRole="button"
                    accessibilityLabel="Close reset modal"
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>
                  {step === 'email'
                    ? 'Enter the email linked to your account to receive a 6-digit verification code.'
                    : `Enter the 6-digit code sent to ${email} and choose a new password.`}
                </Text>

                {/* Status messages */}
                {errorMsg && (
                  <Animated.View
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(120)}
                    style={styles.errorBanner}
                  >
                    <Text style={styles.errorBannerText}>{errorMsg}</Text>
                  </Animated.View>
                )}

                {successInfo && (
                  <Animated.View
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(120)}
                    style={styles.infoBanner}
                  >
                    <Text style={styles.infoBannerText}>{successInfo}</Text>
                  </Animated.View>
                )}

                {/* Form fields */}
                {step === 'email' ? (
                  <View style={styles.formSection}>
                    <AuthInput
                      label="Email"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        setErrorMsg(null);
                      }}
                      placeholder="Enter your email"
                      icon={<MailIcon size={19} color="#72778E" />}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      authMode="login"
                    />

                    <View style={styles.buttonWrapper}>
                      <PrimaryButton
                        title="Send Verification Code"
                        onPress={handleRequestOtp}
                        loading={loading}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.formSection}>
                    <AuthInput
                      label="Verification Code (OTP)"
                      value={otp}
                      onChangeText={(val) => {
                        setOtp(val);
                        setErrorMsg(null);
                      }}
                      placeholder="6-digit code (e.g. 123456)"
                      icon={<KeyIcon size={19} color="#72778E" />}
                      keyboardType="default"
                      autoCapitalize="none"
                      authMode="login"
                    />

                    <AuthInput
                      label="New Password"
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        setErrorMsg(null);
                      }}
                      placeholder="Min 8 chars, 1 uppercase, 1 special (!@#)"
                      icon={<KeyIcon size={19} color="#72778E" />}
                      isPassword
                      authMode="login"
                    />

                    <View style={styles.buttonWrapper}>
                      <PrimaryButton
                        title="Reset & Set Password"
                        onPress={handleConfirmReset}
                        loading={loading}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setStep('email');
                        setErrorMsg(null);
                      }}
                      style={styles.backButton}
                    >
                      <Text style={styles.backButtonText}>← Use different email</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 17, 34, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 420,
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      default: {
        boxShadow: '0px 14px 40px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111317',
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  formSection: {
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 6,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  backButtonText: {
    fontSize: 13.5,
    color: '#6366F1',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 12.5,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBanner: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  infoBannerText: {
    color: '#4338CA',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
