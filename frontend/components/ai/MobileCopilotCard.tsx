import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { aiApi } from '../../services/api/aiApi';
import { useToast } from '../../context/ToastContext';

interface MobileCopilotCardProps {
  totalIncidents?: number;
  activeIncidents?: number;
  resolvedIncidents?: number;
  recentTitles?: string[];
}

export const MobileCopilotCard: React.FC<MobileCopilotCardProps> = ({
  totalIncidents = 0,
  activeIncidents = 0,
  resolvedIncidents = 0,
  recentTitles = [],
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const runCopilot = async (customPrompt: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await aiApi.generateAI({
        prompt: customPrompt,
        system:
          'You are Pulse AI Copilot, an operational incident commander assistant. Provide concise, high-impact bulleted summaries and clear operational directives.',
      });
      if (res.data?.text) {
        setResponse(res.data.text);
      } else {
        showToast('Unable to complete AI analysis', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Copilot query failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() || loading) return;
    runCopilot(prompt.trim());
    setPrompt('');
  };

  const handleCopy = () => {
    if (!response) return;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(response).catch(() => {});
    }
    setCopied(true);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.sparkleIconWrapper}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                fill="#5B45F5"
              />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.titleWithBadge}>
              <Text style={styles.title}>Pulse AI Copilot</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              Turn incident telemetry into actionable operational directives.
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Action Chips in Light Mode */}
      <View style={styles.chipsContainer}>
        <TouchableOpacity
          style={styles.chip}
          disabled={loading}
          activeOpacity={0.7}
          onPress={() =>
            runCopilot(
              `Summarize active incidents: ${totalIncidents} total, ${activeIncidents} in-flight, ${resolvedIncidents} resolved. Recent: ${recentTitles.slice(0, 4).join(', ') || 'API latency spike, Database degraded, Auth timeout'}. Provide brief action points.`
            )
          }
        >
          <Text style={styles.chipText} numberOfLines={1}>
            ⚡ Summarize incidents
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chip}
          disabled={loading}
          activeOpacity={0.7}
          onPress={() =>
            runCopilot(
              `Generate priority triage recommendations for responder coordinator based on ${activeIncidents} active incidents.`
            )
          }
        >
          <Text style={styles.chipText} numberOfLines={1}>
            🎯 Triage priorities
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chip}
          disabled={loading}
          activeOpacity={0.7}
          onPress={() =>
            runCopilot(
              `Draft an urgent operational dispatch memo to team responders regarding current service status.`
            )
          }
        >
          <Text style={styles.chipText} numberOfLines={1}>
            📋 Draft memo
          </Text>
        </TouchableOpacity>
      </View>

      {/* AI Loading State */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#5B45F5" />
          <Text style={styles.loadingText}>Synthesizing operational directives...</Text>
        </View>
      )}

      {/* AI Response Card in Light Mode */}
      {response && !loading && (
        <View style={styles.responseBox}>
          <View style={styles.responseHeader}>
            <Text style={styles.responseTag}>AI DIRECTIVE</Text>
            <TouchableOpacity
              onPress={handleCopy}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Text style={styles.copyButtonText}>{copied ? '✓ Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}

      {/* Input Prompt Box in Light Mode */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask Copilot (e.g. prioritize triage)..."
          placeholderTextColor="#94A3B8"
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!prompt.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={!prompt.trim() || loading}
          activeOpacity={0.8}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    ...Platform.select({
      ios: {
        shadowColor: '#101226',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 2px 8px rgba(16, 18, 38, 0.04))',
      },
    }),
  },
  headerRow: {
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sparkleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#15803D',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  chipText: {
    fontSize: 11,
    color: '#101226',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 11.5,
    color: '#5B45F5',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  responseBox: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    marginBottom: 14,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9F0',
  },
  responseTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5B45F5',
    letterSpacing: 0.8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  copyButtonText: {
    fontSize: 11,
    color: '#5B45F5',
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  responseText: {
    fontSize: 12.5,
    color: '#101226',
    lineHeight: 19,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#101226',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#5B45F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
