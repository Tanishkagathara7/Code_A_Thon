import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii } from '../../theme/colors';
import { AIUsageInfo } from '../../types/ai';

interface AIResponseCardProps {
  title?: string;
  text: string;
  model?: string;
  usage?: AIUsageInfo;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  title = 'AI Insight',
  text,
  model,
  usage,
  onDismiss,
  style,
}) => {
  return (
    <View style={[styles.card, style]} testID="ai-response-card">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={16} color={Colors.accent} style={styles.titleIcon} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightHeaderGroup}>
          {model ? (
            <View style={styles.modelBadge}>
              <Text style={styles.modelText}>{model}</Text>
            </View>
          ) : null}

          {onDismiss ? (
            <TouchableOpacity onPress={onDismiss} style={styles.dismissButton} testID="ai-response-dismiss">
              <Ionicons name="close" size={18} color={Colors.mutedText} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Text style={styles.contentText}>{text}</Text>

      {usage && (usage.promptTokens || usage.completionTokens || usage.totalTokens) ? (
        <View style={styles.footer}>
          <Text style={styles.usageText}>
            Tokens: {usage.totalTokens ?? ((usage.promptTokens || 0) + (usage.completionTokens || 0))}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs + 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: Spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  rightHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelBadge: {
    backgroundColor: Colors.surfaceHover,
    paddingHorizontal: Spacing.xs + 4,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modelText: {
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 2,
  },
  contentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  footer: {
    marginTop: Spacing.xs + 4,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
  },
  usageText: {
    fontSize: 11,
    color: Colors.subtleText,
  },
});
