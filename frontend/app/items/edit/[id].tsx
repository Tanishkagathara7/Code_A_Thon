import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hackathonItemApi } from '../../../services/api/hackathonItemApi';
import { HackathonItem, CreateItemPayload } from '../../../types/domain';
import { DomainForm } from '../../../components/domain/DomainForm';
import { LoadingState } from '../../../components/domain/LoadingState';
import { ErrorState } from '../../../components/domain/ErrorState';
import { AppHeader } from '../../../components/navigation/AppHeader';

import { useNetwork } from '../../../context/NetworkContext';
import { useToast } from '../../../context/ToastContext';
import { appConfig } from '../../../config/appConfig';

export default function ItemEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();

  const [item, setItem] = useState<HackathonItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const fetchItem = async () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await hackathonItemApi.getItem(id);
      if (response.data) {
        setItem(response.data);
      } else {
        setLoadError('Item not found.');
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load item for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleSubmit = async (values: CreateItemPayload) => {
    if (!id) return;
    if (isOffline) {
      setServerError("You're offline. Reconnect to save your changes.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      await hackathonItemApi.updateItem(id, values);
      showToast('Item updated successfully!', 'success');
      router.replace(`/items/${id}`);
    } catch (err: any) {
      const msg = err.message || 'Failed to update item.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Clean White Web Header */}
      <AppHeader
        title={`Edit ${appConfig.primaryEntityName}`}
        subtitle={item?.title ? `Updating "${item.title}"` : 'Modify operational parameters'}
        onBack={() => router.back()}
        backText="Cancel"
      />

      {/* Body */}
      <View style={styles.body}>
        {isLoading ? (
          <LoadingState message={`Loading ${appConfig.primaryEntityName.toLowerCase()} details...`} count={1} />
        ) : loadError || !item ? (
          <ErrorState
            message={loadError || 'Unable to retrieve item data.'}
            onRetry={fetchItem}
          />
        ) : (
          <DomainForm
            initialValues={{
              title: item.title,
              description: item.description,
              status: item.status,
              category: item.category,
            }}
            submitButtonText={`Save Changes`}
            isSubmitting={isSubmitting}
            serverError={serverError}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        )}
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
