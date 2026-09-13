import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { CreateItemPayload } from '../../types/domain';
import { DomainForm } from '../../components/domain/DomainForm';

import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { appConfig } from '../../config/appConfig';

export default function ItemCreateScreen() {
  const router = useRouter();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (values: CreateItemPayload) => {
    if (isOffline) {
      setServerError("You're offline. Reconnect to save your changes.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await hackathonItemApi.createItem(values);
      showToast('Item created successfully!', 'success');
      if (result.data?.id) {
        router.replace(`/items/${result.data.id}`);
      } else {
        router.replace('/items');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to create item. Please check inputs.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1E274A', '#2D3A6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New {appConfig.primaryEntityName}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        <DomainForm
          submitButtonText={`Create ${appConfig.primaryEntityName}`}
          isSubmitting={isSubmitting}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E274A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  headerSpacer: {
    width: 60,
  },
  body: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
});
