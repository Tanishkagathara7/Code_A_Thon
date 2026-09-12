import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface AuthBottomSheetProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({ children, style }) => {
  return (
    <View style={[styles.sheetContainer, style]}>
      <View style={styles.sheetHandle} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
});
