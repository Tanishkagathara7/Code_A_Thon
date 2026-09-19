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

      {/* Clean Header */}
      <AppHeader
        title="Tax Invoice"
        subtitle={item?.id ? `ID: ${item.id.slice(-6).toUpperCase()}` : undefined}
        onBack={() => router.back()}
        backText="Bills"
      />

      {/* Body */}
      <View style={styles.body}>
        {isLoading ? (
          <LoadingState message="Fetching tax invoice..." count={1} />
        ) : error || !item ? (
          <ErrorState message={error || 'Invoice not found'} onRetry={fetchDetail} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {(() => {
              const attrs = (item.attributes || {}) as any;
              const invoiceNo = attrs.invoiceNo || (item.title.includes('•') ? item.title.split('•')[0].trim() : `INV-2026-${item.id.slice(-4).toUpperCase()}`);
              const partyName = attrs.party?.name || (item.title.includes('•') ? item.title.split('•')[1].trim() : item.title);
              const partyState = attrs.party?.state || item.category || 'Gujarat';
              const partyGstin = attrs.party?.gstin || 'Unregistered';
              const partyMobile = attrs.party?.mobile || '9825123456';
              const grandTotal = attrs.grandTotal || 7665;
              const subtotal = attrs.subtotal || Math.round(grandTotal / 1.05);
              const totalTax = attrs.totalTax || (grandTotal - subtotal);
              const paymentStatus = attrs.paymentStatus || (item.status === 'completed' ? 'Paid in Full' : 'Unpaid / Due');
              const isPaid = paymentStatus === 'Paid in Full';
              const itemsList = attrs.items || [
                { name: 'Basmati Rice (25kg Bag)', hsn: '1006', qty: 2, rate: 1850, gstRate: 5, totalAmount: 3885 },
                { name: 'Groundnut Oil (15L Tin)', hsn: '1508', qty: 1, rate: 2750, gstRate: 5, totalAmount: 2887.5 },
              ];

              return (
                <View style={styles.card}>
                  {/* Status & Invoice Number */}
                  <View style={styles.topRow}>
                    <View style={styles.invoiceNoPill}>
                      <Text style={styles.invoiceNoText}>{invoiceNo}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7' }]}>
                      <Text style={[styles.statusText, { color: isPaid ? '#15803D' : '#B45309' }]}>
                        {paymentStatus}
                      </Text>
                    </View>
                  </View>

                  {/* Customer / Party Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionHeading}>BILLED TO (CUSTOMER)</Text>
                    <Text style={styles.partyName}>{partyName}</Text>
                    <Text style={styles.partyDetail}>State: {partyState} • Mobile: {partyMobile}</Text>
                    <Text style={styles.partyDetail}>GSTIN: {partyGstin}</Text>
                  </View>

                  {/* Itemized Table */}
                  <View style={styles.section}>
                    <Text style={styles.sectionHeading}>INVOICE ITEMS</Text>
                    <View style={styles.itemsBox}>
                      {itemsList.map((it: any, i: number) => (
                        <View key={i} style={styles.itemRowBox}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.itemRowName}>{it.name}</Text>
                            <Text style={styles.itemRowSub}>
                              HSN: {it.hsn || '9983'} • Qty: {it.qty} × ₹{Number(it.rate).toLocaleString('en-IN')} (GST {it.gstRate}%)
                            </Text>
                          </View>
                          <Text style={styles.itemRowTotal}>
                            ₹{Number(it.totalAmount || (it.qty * it.rate * 1.05)).toLocaleString('en-IN')}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Statutory Tax Summary Box */}
                  <View style={styles.taxSummaryBox}>
                    <View style={styles.taxRow}>
                      <Text style={styles.taxLabel}>Taxable Subtotal:</Text>
                      <Text style={styles.taxVal}>₹{Number(subtotal).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.taxRow}>
                      <Text style={styles.taxLabel}>Total GST (CGST+SGST):</Text>
                      <Text style={styles.taxVal}>₹{Number(totalTax).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={[styles.taxRow, styles.grandTotalRow]}>
                      <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
                      <Text style={styles.grandTotalVal}>₹{Number(grandTotal).toLocaleString('en-IN')}</Text>
                    </View>
                  </View>

                  {/* Actions: Delete & Back */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => setShowDeleteModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.deleteButtonText}>Delete Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })()}
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
  invoiceNoPill: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  invoiceNoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  partyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0A0A',
    fontFamily: 'PlusJakartaSans_700Bold',
    marginTop: 2,
  },
  partyDetail: {
    fontSize: 12.5,
    color: '#52525B',
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  itemsBox: {
    backgroundColor: '#FAFAF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: 10,
    gap: 8,
  },
  itemRowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  itemRowName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  itemRowSub: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  itemRowTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A0A0A',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  taxSummaryBox: {
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginTop: 4,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taxLabel: {
    fontSize: 12,
    color: '#52525B',
    fontWeight: '500',
  },
  taxVal: {
    fontSize: 12,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  grandTotalRow: {
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0A0A0A',
  },
  grandTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0A0A0A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F9',
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
