import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { CreateItemPayload } from '../../types/domain';
import { DomainForm } from '../../components/domain/DomainForm';
import { AppHeader } from '../../components/navigation/AppHeader';
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Clean White Web-Parity Header */}
      <AppHeader
        title={`Create New ${appConfig.primaryEntityName}`}
        subtitle="Add an operational record to the repository"
        onBack={() => router.back()}
        backText="Cancel"
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
});
