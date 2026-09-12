import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppTheme, DefaultTheme } from '../../theme/config';

interface DividerProps {
  label?: string;
  theme?: AppTheme;
}

export const Divider: React.FC<DividerProps> = ({
  label = 'OR CONTINUE WITH',
  theme = DefaultTheme,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <Text style={[styles.text, { color: theme.colors.mutedText }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
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
  },
  text: {
    paddingHorizontal: 12,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
