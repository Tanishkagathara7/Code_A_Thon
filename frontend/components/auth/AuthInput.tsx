import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography, Spacing } from '../../theme/typography';
import { EyeIcon } from '../icons/Icons';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  authMode?: 'login' | 'signup';
  autoComplete?: any;
  textContentType?: any;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  authMode = 'login',
  autoComplete,
  textContentType,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const focusBorderColor =
    authMode === 'login'
      ? Colors.input.borderFocus
      : Colors.input.borderFocusSignup;

  return (
    <View style={styles.container}>
      <Text style={Typography.inputLabel}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: isFocused ? focusBorderColor : '#EAECEF',
            backgroundColor: '#F8F9FA',
            ...Platform.select({
              ios: {
                shadowColor: isFocused ? focusBorderColor : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isFocused ? 0.12 : 0,
                shadowRadius: 5,
              },
              default: {
                boxShadow: isFocused
                  ? `0px 0px 0px 2px ${focusBorderColor}22`
                  : 'none',
              },
            }),
          },
        ]}
      >
        <View style={styles.iconContainer}>{icon}</View>

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA0B2"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            activeOpacity={0.7}
          >
            <EyeIcon size={20} color="#7E8398" visible={showPassword} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 22,
    borderWidth: 1.2,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    ...Typography.inputText,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
