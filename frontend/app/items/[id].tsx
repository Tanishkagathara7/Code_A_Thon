import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { HackathonItem } from '../../types/domain';
import { LoadingState } from '../../components/domain/LoadingState';
import { ErrorState } from '../../components/domain/ErrorState';
import { ConfirmDeleteModal } from '../../components/domain/ConfirmDeleteModal';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

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
    setIsDeleting(true);
    try {
      await hackathonItemApi.deleteItem(id);
      setShowDeleteModal(false);
      router.replace('/items');
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: '#DCFCE7', text: '#15803D', label: 'Completed' };
      case 'in_progress':
        return { bg: '#E0E7FF', text: '#4338CA', label: 'In Progress' };
      case 'pending':
      default:
        return { bg: '#FEF3C7', text: '#B45309', label: 'Pending' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1E274A', '#2D3A6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

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
                  <Text style={styles.editButtonText}>✏️ Edit Item</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
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
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      default: {
        filter: 'drop-shadow(0px 4px 12px rgba(24, 24, 27, 0.05))',
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 20,
    lineHeight: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  descriptionText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  metaBox: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaKey: {
    fontSize: 13,
    color: '#71717A',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  metaVal: {
    fontSize: 13,
    color: '#18181B',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
