import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Spacing, Radii } from '../../theme/colors';
import { aiApi } from '../../services/api/aiApi';
import { AIGeneratedResult } from '../../types/ai';
import { AIActionButton } from './AIActionButton';
import { AIResponseCard } from './AIResponseCard';
import { AIErrorState } from './AIErrorState';
import { appConfig } from '../../config/appConfig';

interface AISummarizerCardProps {
  initialText?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export const AISummarizerCard: React.FC<AISummarizerCardProps> = ({
  initialText = '',
  placeholder = 'Paste or type text here to summarize with AI...',
  style,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIGeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter text to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await aiApi.summarizeText(text);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || 'Failed to generate summary.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during summarization.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissResult = () => {
    setResult(null);
  };

  return (
    <View style={[styles.card, style]} testID="ai-summarizer-card">
      <Text style={styles.headerTitle}>✨ AI Text Summarizer</Text>
      <Text style={styles.headerSubtitle}>
        Generate rapid summaries using the OpenRouter AI gateway.
      </Text>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={(val) => {
          setText(val);
          if (error) setError(null);
        }}
        placeholder={placeholder}
        placeholderTextColor={Colors.subtleText}
        testID="ai-summarizer-input"
      />

      <View style={styles.actionRow}>
        <AIActionButton
          onPress={handleSummarize}
          title="Summarize with AI"
          loading={loading}
          disabled={!text.trim()}
        />
      </View>

      {error ? (
        <AIErrorState errorMessage={error} onRetry={handleSummarize} />
      ) : null}

      {result ? (
        <AIResponseCard
          title="Summary Result"
          text={result.text}
          model={result.model}
          usage={result.usage}
          onDismiss={handleDismissResult}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.mutedText,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.sm + 2,
    fontSize: 14,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: Spacing.sm,
  },
  actionRow: {
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
});
