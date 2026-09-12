import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FileUploadField } from '../FileUploadField';
import { UploadedFile } from '../../types/file';
import { Colors, Radii, Spacing } from '../../theme/colors';

export const FileUploadDemoCard: React.FC = () => {
  const [lastUploadedFile, setLastUploadedFile] = useState<UploadedFile | null>(null);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-upload" size={20} color={Colors.accent} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>File & Image Upload Foundation</Text>
          <Text style={styles.subtitle}>
            Test selecting images or PDF documents with server validation & preview.
          </Text>
        </View>
      </View>

      <FileUploadField
        label="Test File / Image Upload"
        mode="all"
        onUploadSuccess={(file) => {
          setLastUploadedFile(file);
        }}
        onRemove={() => {
          setLastUploadedFile(null);
        }}
      />

      {lastUploadedFile && (
        <View style={styles.infoBadge}>
          <Ionicons name="information-circle-outline" size={18} color="#0D9488" style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Metadata Saved in Database:</Text>
            <Text style={styles.infoText}>• ID: {lastUploadedFile.id}</Text>
            <Text style={styles.infoText}>• Provider: {lastUploadedFile.storageProvider || 'local_dev'}</Text>
            <Text style={styles.infoText}>• Type: {lastUploadedFile.mimeType}</Text>
            <Text style={styles.infoText}>• URL: {lastUploadedFile.url}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg || 16,
    padding: Spacing.md || 16,
    marginVertical: Spacing.xs || 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm || 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm || 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: Spacing.sm || 10,
    borderRadius: Radii.md || 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginTop: Spacing.xs || 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 11,
    color: '#115E59',
  },
});
