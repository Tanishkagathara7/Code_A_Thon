import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { EyeIcon } from '../icons/Icons';
import { AppTheme, DefaultTheme } from '../../theme/config';
import { Typography } from '../../theme/typography';

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
      ? '#FFFFFF'
      : '#F8F9FA';

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
          accessibilityLabel={label}
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
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: Typography.inputLabel.fontFamily,
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 7,
    letterSpacing: -0.2,
  },
  inputBox: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
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
    fontFamily: Typography.inputText.fontFamily,
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 4,
  },
});
