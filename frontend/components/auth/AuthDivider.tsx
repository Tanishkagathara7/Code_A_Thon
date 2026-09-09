import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Typography } from '../../theme/typography';

interface AuthDividerProps {
  authMode: 'login' | 'signup';
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ authMode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>
        {authMode === 'login' ? 'Or log in with' : 'Or sign up with'}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E7E9EF',
  },
  text: {
    ...Typography.dividerText,
  },
});
