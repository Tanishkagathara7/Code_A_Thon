import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface AuthCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
});
