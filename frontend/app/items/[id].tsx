import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { HackathonItem } from '../../types/domain';
import { LoadingState } from '../../components/domain/LoadingState';
import { ErrorState } from '../../components/domain/ErrorState';
import { ConfirmDeleteModal } from '../../components/domain/ConfirmDeleteModal';
import { AppHeader } from '../../components/navigation/AppHeader';

import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { appConfig } from '../../config/appConfig';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isOffline } = useNetwork();
  const { showToast } = useToast();

  const [item, setItem] = useState<HackathonItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await hackathonItemApi.getItem(id);
      if (response.data) {
        setItem(response.data);
      } else {
        setError('Item details not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch item details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!id) return;
    if (isOffline) {
      showToast("You're offline. Reconnect to delete this item.", 'error');
      setShowDeleteModal(false);
      return;
    }

    setIsDeleting(true);
    try {
      await hackathonItemApi.deleteItem(id);
      setShowDeleteModal(false);
      showToast('Item deleted successfully.', 'info');
      router.replace('/items');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: '#DCFCE7', text: '#15803D', label: 'Resolved / Done' };
      case 'in_progress':
        return { bg: '#EDE9FE', text: '#5B45F5', label: 'In Transit / Active' };
      case 'pending':
      default:
        return { bg: '#FEF3C7', text: '#B45309', label: 'Triage / Pending' };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Clean White Web Header */}
      <AppHeader
        title={`${appConfig.primaryEntityName} Details`}
        subtitle={item?.id ? `ID: ${item.id.slice(0, 8)}...` : undefined}
        onBack={() => router.back()}
        backText="Back"
      />

      {/* Body */}
      <View style={styles.body}>
        {isLoading ? (
          <LoadingState message="Fetching item details..." count={1} />
        ) : error || !item ? (
          <ErrorState message={error || 'Item not found'} onRetry={fetchDetail} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {/* Status & Category row */}
              <View style={styles.topRow}>
                {item.category ? (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                ) : (
                  <View />
                )}

                {(() => {
                  const statusInfo = getStatusBadge(item.status);
                  return (
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                      <Text style={[styles.statusText, { color: statusInfo.text }]}>
                        {statusInfo.label}
                      </Text>
                    </View>
                  );
                })()}
              </View>

              {/* Title */}
              <Text style={styles.title}>{item.title}</Text>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>Description</Text>
                <Text style={styles.descriptionText}>
                  {item.description || 'No description provided.'}
                </Text>
              </View>

              {/* Metadata details */}
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>Metadata</Text>
                <View style={styles.metaBox}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Item ID:</Text>
                    <Text style={styles.metaVal}>{item.id}</Text>
                  </View>
                  {item.owner ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaKey}>Owner ID:</Text>
                      <Text style={styles.metaVal}>{item.owner}</Text>
                    </View>
                  ) : null}
                  {item.createdAt ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaKey}>Created At:</Text>
                      <Text style={styles.metaVal}>
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  ) : null}
                  {item.updatedAt ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaKey}>Updated At:</Text>
                      <Text style={styles.metaVal}>
                        {new Date(item.updatedAt).toLocaleString()}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/items/edit/${item.id}`)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editButtonText}>Edit {appConfig.primaryEntityName}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      <ConfirmDeleteModal
        visible={showDeleteModal}
        itemTitle={item?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#101226',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#68728A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#101226',
    lineHeight: 22,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  metaBox: {
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    padding: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaKey: {
    fontSize: 12,
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  metaVal: {
    fontSize: 12,
    color: '#101226',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F9',
  },
  editButton: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#5B45F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  deleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
