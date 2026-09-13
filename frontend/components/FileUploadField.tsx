import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilePicker } from './FilePicker';
import { fileApi } from '../services/api/fileApi';
import { FileSelection, UploadedFile, UploadState, SupportedFileType } from '../types/file';
import { Colors, Radii, Spacing } from '../theme/colors';

export interface FileUploadFieldProps {
  label?: string;
  mode?: SupportedFileType;
  initialFile?: UploadedFile | null;
  onUploadSuccess?: (file: UploadedFile) => void;
  onRemove?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label = 'Upload File',
  mode = 'all',
  initialFile = null,
  onUploadSuccess,
  onRemove,
  onError,
  disabled = false,
}) => {
  const [state, setState] = useState<UploadState>(initialFile ? 'success' : 'idle');
  const [selectedFile, setSelectedFile] = useState<FileSelection | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(initialFile);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = async (selection: FileSelection) => {
    setSelectedFile(selection);
    setErrorMessage('');
    setState('selected');
    await startUpload(selection);
  };

  const startUpload = async (selection: FileSelection) => {
    setState('uploading');
    try {
      const response = await fileApi.uploadFile(selection.uri, selection.name, selection.mimeType);
      if (response.success && response.data) {
        setUploadedFile(response.data);
        setState('success');
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      } else {
        throw new Error('Server returned unsuccessful upload response');
      }
    } catch (err: any) {
      const msg = err.message || 'File upload failed. Please try again.';
      setErrorMessage(msg);
      setState('error');
      if (onError) {
        onError(msg);
      }
    }
  };

  const handleRetry = async () => {
    if (selectedFile) {
      await startUpload(selectedFile);
    } else {
      setState('idle');
    }
  };

  const handleRemove = async () => {
    if (uploadedFile && uploadedFile.id) {
      try {
        await fileApi.deleteFile(uploadedFile.id);
      } catch (err) {
        // Clear client state regardless of backend file deletion outcome
      }
    }
    setSelectedFile(null);
    setUploadedFile(null);
    setErrorMessage('');
    setState('idle');
    if (onRemove) {
      onRemove();
    }
  };

  const isImage = (mimeType?: string) => {
    return mimeType ? mimeType.startsWith('image/') : false;
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* IDLE / SELECTING STATE */}
      {state === 'idle' && (
        <FilePicker mode={mode} onFileSelect={handleFileSelect} disabled={disabled} />
      )}

      {/* UPLOADING STATE */}
      {state === 'uploading' && (
        <View style={styles.card}>
          <ActivityIndicator size="small" color={Colors.accent} style={styles.spinner} />
          <View style={styles.textContainer}>
            <Text style={styles.fileName} numberOfLines={1}>
              Uploading {selectedFile?.name}...
            </Text>
            <Text style={styles.fileMeta}>{formatFileSize(selectedFile?.size)}</Text>
          </View>
        </View>
      )}

      {/* SUCCESS STATE */}
      {state === 'success' && uploadedFile && (
        <View style={styles.cardSuccess}>
          {isImage(uploadedFile.mimeType) && selectedFile?.uri ? (
            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.docIconContainer}>
              <Ionicons name="document-text" size={28} color={Colors.accent} />
            </View>
          )}

          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.checkIcon} />
              <Text style={styles.fileName} numberOfLines={1}>
                {uploadedFile.originalName}
              </Text>
            </View>
            <Text style={styles.fileMeta}>
              {uploadedFile.mimeType} • {formatFileSize(uploadedFile.size)}
            </Text>
          </View>

          {!disabled && (
            <TouchableOpacity
              onPress={handleRemove}
              style={styles.removeButton}
              accessibilityRole="button"
              accessibilityLabel="Remove File"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ERROR STATE */}
      {state === 'error' && (
        <View style={styles.cardError}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" style={styles.errorIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.errorTitle}>Upload Failed</Text>
            <Text style={styles.errorText} numberOfLines={2}>
              {errorMessage}
            </Text>
          </View>
          <View style={styles.errorActions}>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemove} style={styles.cancelButton}>
              <Ionicons name="close-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs || 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.xs || 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md || 12,
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.md || 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm || 10,
    backgroundColor: '#ECFDF5',
    borderRadius: Radii.md || 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  cardError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm || 10,
    backgroundColor: '#FEF2F2',
    borderRadius: Radii.md || 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  spinner: {
    marginRight: Spacing.md || 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 4,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  fileMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  imagePreview: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm || 6,
    marginRight: Spacing.md || 12,
  },
  docIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm || 6,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md || 12,
  },
  removeButton: {
    padding: Spacing.xs || 6,
  },
  errorIcon: {
    marginRight: Spacing.sm || 8,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 1,
  },
  errorActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    marginRight: 6,
  },
  retryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 4,
  },
});
