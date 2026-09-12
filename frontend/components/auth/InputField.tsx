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
  Easing,
} from 'react-native-reanimated';
import { EyeIcon } from '../icons/Icons';
import { AppTheme, DefaultTheme } from '../../theme/config';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  error?: string | null;
  theme?: AppTheme;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  isPassword = false,
  error = null,
  theme = DefaultTheme,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const focusProgress = useSharedValue(0);

  const handleFocus = (e: any) => {
    setFocused(true);
    focusProgress.value = withTiming(1, {
      duration: theme.animationDuration.fast,
      easing: Easing.out(Easing.quad),
    });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    focusProgress.value = withTiming(0, {
      duration: theme.animationDuration.fast,
      easing: Easing.out(Easing.quad),
    });
    props.onBlur?.(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? theme.colors.error
      : focused
      ? theme.colors.borderFocus
      : theme.colors.border;
    const backgroundColor = focused
      ? theme.colors.surface
      : theme.colors.surface;

    return {
      borderColor,
      backgroundColor,
    };
  });

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>

      {/* Input Box */}
      <Animated.View style={[styles.inputBox, animatedContainerStyle]}>
        {icon && <View style={styles.leftIcon}>{icon}</View>}

        <TextInput
          style={[styles.textInput, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.subtleText}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon
              size={19}
              color={focused ? theme.colors.text : theme.colors.mutedText}
              visible={showPassword}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Inline Validation Error Text */}
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  inputBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  leftIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 2,
  },
});
