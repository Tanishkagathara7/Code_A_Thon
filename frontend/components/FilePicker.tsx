import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FileSelection, SupportedFileType } from '../types/file';
import { Colors, Radii, Spacing } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export interface FilePickerProps {
  mode?: SupportedFileType;
  onFileSelect: (selection: FileSelection) => void;
  disabled?: boolean;
  buttonTitle?: string;
}

/**
 * Helper function to launch image picker from gallery.
 */
export async function pickImageFromGallery(): Promise<FileSelection | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const uri = asset.uri;
    const name = asset.fileName || `image_${Date.now()}.${asset.mimeType?.split('/')[1] || 'jpg'}`;
    const mimeType = asset.mimeType || 'image/jpeg';
    const size = asset.fileSize || 0;

    return { uri, name, mimeType, size };
  } catch (error: any) {
    Alert.alert('Image Selection Failed', error.message || 'Unable to select image from gallery.');
    return null;
  }
}

/**
 * Helper function to launch document picker.
 */
export async function pickDocumentFromDevice(typeFilter: string[] = ['application/pdf', 'image/*']): Promise<FileSelection | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: typeFilter,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType || 'application/octet-stream',
      size: asset.size || 0,
    };
  } catch (error: any) {
    Alert.alert('Document Selection Failed', error.message || 'Unable to pick document from device.');
    return null;
  }
}

/**
 * Reusable FilePicker Component.
 */
export const FilePicker: React.FC<FilePickerProps> = ({
  mode = 'all',
  onFileSelect,
  disabled = false,
  buttonTitle,
}) => {
  const handlePress = async () => {
    if (disabled) return;

    if (mode === 'image') {
      const selected = await pickImageFromGallery();
      if (selected) onFileSelect(selected);
    } else if (mode === 'document') {
      const selected = await pickDocumentFromDevice(['application/pdf']);
      if (selected) onFileSelect(selected);
    } else {
      Alert.alert(
        'Select Source',
        'Choose where to select your file from',
        [
          {
            text: 'Photo Gallery',
            onPress: async () => {
              const selected = await pickImageFromGallery();
              if (selected) onFileSelect(selected);
            },
          },
          {
            text: 'Documents / PDF',
            onPress: async () => {
              const selected = await pickDocumentFromDevice(['application/pdf', 'image/*']);
              if (selected) onFileSelect(selected);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const title = buttonTitle || (mode === 'image' ? 'Pick Image' : mode === 'document' ? 'Pick Document' : 'Select File');

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Ionicons
        name={mode === 'image' ? 'image-outline' : mode === 'document' ? 'document-text-outline' : 'cloud-upload-outline'}
        size={20}
        color={disabled ? '#999' : Colors.accent}
        style={styles.icon}
      />
      <Text style={[styles.buttonText, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md || 12,
    paddingHorizontal: Spacing.lg || 16,
    borderRadius: Radii.md || 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    backgroundColor: '#F4F7FF',
  },
  buttonDisabled: {
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginRight: Spacing.xs || 6,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
  textDisabled: {
    color: '#999',
  },
});
