import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Spacing } from '../../theme/typography';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  // Max width constraint for tablet, desktop, and large displays
  const isLargeScreen = width > 520;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.card,
          isLargeScreen && styles.cardLarge,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: Platform.select({ ios: 44, android: 32, default: 36 }),
    ...Platform.select({
      ios: {
        shadowColor: '#070C1E',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: '0px -10px 40px rgba(7, 12, 30, 0.09), inset 0px 1px 0px rgba(255, 255, 255, 0.9)',
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 0,
  },
  cardLarge: {
    maxWidth: 480,
    borderRadius: 38,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: 24,
  },
});
