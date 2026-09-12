import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { EyeIcon } from '../icons/Icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  authMode?: 'login' | 'signup';
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  isPassword = false,
  authMode = 'login',
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: focused ? '#818CF8' : '#E2E8F0',
    backgroundColor: focused ? '#FFFFFF' : '#F8FAFC',
  }));

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input Container */}
      <Animated.View style={[styles.inputContainer, animatedContainerStyle]}>
        {icon && <View style={styles.leftIconWrapper}>{icon}</View>}

        <TextInput
          style={styles.textInput}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconWrapper}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon size={20} color="#64748B" visible={showPassword} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  inputContainer: {
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftIconWrapper: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconWrapper: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    height: '100%',
  },
});
