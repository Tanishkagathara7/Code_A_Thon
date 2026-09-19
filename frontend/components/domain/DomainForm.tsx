import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CreateItemPayload, ItemStatus } from '../../types/domain';
import { appConfig } from '../../config/appConfig';

interface DomainFormProps {
  initialValues?: Partial<CreateItemPayload>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  serverError?: string | null;
  onSubmit: (values: CreateItemPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: { key: ItemStatus; label: string; activeBorder: string; activeBg: string; activeText: string }[] = [
  {
    key: 'pending',
    label: 'Triage / Pending',
    activeBorder: '#F59E0B',
    activeBg: '#FEF3C7',
    activeText: '#B45309',
  },
  {
    key: 'in_progress',
    label: 'In Transit / Active',
    activeBorder: '#5B45F5',
    activeBg: '#EDE9FE',
    activeText: '#5B45F5',
  },
  {
    key: 'completed',
    label: 'Resolved / Done',
    activeBorder: '#10B981',
    activeBg: '#DCFCE7',
    activeText: '#15803D',
  },
];

export const DomainForm: React.FC<DomainFormProps> = ({
  initialValues = {},
  isSubmitting = false,
  submitButtonText = `Save ${appConfig.primaryEntityName}`,
  serverError,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [status, setStatus] = useState<ItemStatus>(initialValues.status || 'pending');
  const [category, setCategory] = useState(initialValues.category || '');

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [catError, setCatError] = useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;

    if (!title || title.trim() === '') {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.trim().length > 100) {
      setTitleError('Title cannot exceed 100 characters');
      isValid = false;
    } else {
      setTitleError(null);
    }

    if (description && description.length > 1000) {
      setDescError('Description cannot exceed 1000 characters');
      isValid = false;
    } else {
      setDescError(null);
    }

    if (category && category.length > 50) {
      setCatError('Category cannot exceed 50 characters');
      isValid = false;
    } else {
      setCatError(null);
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      status,
      category: category.trim() ? category.trim() : undefined,
    });
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {serverError ? (
          <View style={styles.serverErrorBox}>
            <Text style={styles.serverErrorText}>⚠️ {serverError}</Text>
          </View>
        ) : null}

        {/* Title Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Title <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'title' ? styles.inputFocused : null,
              titleError ? styles.inputError : null,
            ]}
            placeholder="e.g. Build Hackathon MVP"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError(null);
            }}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            maxLength={100}
            editable={!isSubmitting}
            accessibilityLabel="Item title input"
          />
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        </View>

        {/* Description Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              focusedField === 'desc' ? styles.inputFocused : null,
              descError ? styles.inputError : null,
            ]}
            placeholder="Provide relevant details or context..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (descError) setDescError(null);
            }}
            onFocus={() => setFocusedField('desc')}
            onBlur={() => setFocusedField(null)}
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
            editable={!isSubmitting}
            accessibilityLabel="Item description input"
          />
          {descError ? <Text style={styles.errorText}>{descError}</Text> : null}
        </View>

        {/* Status Selector Chips */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.chipsRow}>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = status === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.statusChip,
                    isSelected
                      ? { backgroundColor: opt.activeBg, borderColor: opt.activeBorder }
                      : styles.statusChipInactive,
                  ]}
                  onPress={() => setStatus(opt.key)}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Select status ${opt.label}`}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      isSelected
                        ? { color: opt.activeText, fontWeight: '700' }
                        : styles.statusChipTextInactive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'category' ? styles.inputFocused : null,
              catError ? styles.inputError : null,
            ]}
            placeholder="e.g. Engineering, Design, General"
            placeholderTextColor="#94A3B8"
            value={category}
            onChangeText={(text) => {
              setCategory(text);
              if (catError) setCatError(null);
            }}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField(null)}
            maxLength={50}
            editable={!isSubmitting}
            accessibilityLabel="Item category input"
          />
          {catError ? <Text style={styles.errorText}>{catError}</Text> : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {onCancel ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isSubmitting}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, onCancel ? styles.flex : null]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    backgroundColor: '#F8F9FC',
  },
  serverErrorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  serverErrorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#101226',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.1,
  },
  requiredStar: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: '#101226',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  inputFocused: {
    borderColor: '#5B45F5',
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#5B45F5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  multilineInput: {
    minHeight: 110,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E9F0',
  },
  statusChipText: {
    fontSize: 12.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statusChipTextInactive: {
    color: '#68728A',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingBottom: 32,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#101226',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#5B45F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#5B45F5',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        filter: 'drop-shadow(0px 3px 8px rgba(91, 69, 245, 0.28))',
      },
    }),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
