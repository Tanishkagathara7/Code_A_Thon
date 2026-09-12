import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface AuthDividerProps {
  authMode?: 'login' | 'signup';
}

export const AuthDivider: React.FC<AuthDividerProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>Or continue with</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  text: {
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: -0.1,
  },
});
