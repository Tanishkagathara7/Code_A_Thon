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
import { LinearGradient } from 'expo-linear-gradient';
import { CreateItemPayload, ItemStatus } from '../../types/domain';

interface DomainFormProps {
  initialValues?: Partial<CreateItemPayload>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  serverError?: string | null;
  onSubmit: (values: CreateItemPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: { key: ItemStatus; label: string; bg: string; text: string }[] = [
  { key: 'pending', label: 'Pending', bg: '#FEF3C7', text: '#B45309' },
  { key: 'in_progress', label: 'In Progress', bg: '#E0E7FF', text: '#4338CA' },
  { key: 'completed', label: 'Completed', bg: '#DCFCE7', text: '#15803D' },
];

export const DomainForm: React.FC<DomainFormProps> = ({
  initialValues = {},
  isSubmitting = false,
  submitButtonText = 'Save Item',
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
            style={[styles.input, titleError ? styles.inputError : null]}
            placeholder="e.g. Build Hackathon MVP"
            placeholderTextColor="#A1A1AA"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError(null);
            }}
            maxLength={100}
            editable={!isSubmitting}
          />
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        </View>

        {/* Description Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput, descError ? styles.inputError : null]}
            placeholder="Provide relevant details or context..."
            placeholderTextColor="#A1A1AA"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (descError) setDescError(null);
            }}
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
            editable={!isSubmitting}
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
                    { backgroundColor: opt.bg },
                    isSelected ? styles.statusChipSelected : null,
                  ]}
                  onPress={() => setStatus(opt.key)}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      { color: opt.text },
                      isSelected ? styles.statusChipTextSelected : null,
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
            style={[styles.input, catError ? styles.inputError : null]}
            placeholder="e.g. Engineering, Design, General"
            placeholderTextColor="#A1A1AA"
            value={category}
            onChangeText={(text) => {
              setCategory(text);
              if (catError) setCatError(null);
            }}
            maxLength={50}
            editable={!isSubmitting}
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
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#4F46E5', '#3730A3']} style={styles.gradient}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>{submitButtonText}</Text>
              )}
            </LinearGradient>
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
  },
  serverErrorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  serverErrorText: {
    color: '#991B1B',
    fontSize: 13.5,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  requiredStar: {
    color: '#DC2626',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  multilineInput: {
    minHeight: 100,
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusChipSelected: {
    borderColor: '#4F46E5',
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statusChipTextSelected: {
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#27272A',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
