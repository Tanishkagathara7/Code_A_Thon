import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { customerApi } from '../../services/api/customerApi';
import { CustomerRecord } from '../../types/domain';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useToast } from '../../context/ToastContext';

export default function CustomersListScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'business' | 'individual'>('all');

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await customerApi.getCustomers({
        search: search.trim() || undefined,
        customerType: selectedType !== 'all' ? selectedType : undefined,
      });
      if (res?.data) {
        setCustomers(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load customers', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedType]);

  useEffect(() => {
    setLoading(true);
    fetchCustomers();
  }, [fetchCustomers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleCall = (mobile: string) => {
    if (!mobile) return;
    Linking.openURL(`tel:${mobile}`).catch(() => {
      showToast('Could not open phone dialer', 'error');
    });
  };

  const handleDelete = (c: CustomerRecord) => {
    Alert.alert(
      'Delete Customer',
      `Delete record for ${c.name}? Existing invoices will retain their historical snapshot.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await customerApi.deleteCustomer(c.id || (c as any)._id);
              showToast('Customer deleted', 'info');
              fetchCustomers();
            } catch (err: any) {
              showToast(err.message || 'Failed to delete customer', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Customers & Parties"
        subtitle={`${customers.length} registered parties`}
        onBack={() => router.back()}
        backText="Back"
        rightAction={
          <TouchableOpacity
            style={styles.addHeaderBtn}
            onPress={() => router.push('/customers/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.addHeaderBtnText}>+ Add Party</Text>
          </TouchableOpacity>
        }
      />

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="#68728A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search party name, mobile, GSTIN, city..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Segmented Filter: All / Business / Individual */}
      <View style={styles.segmentRow}>
        {(['all', 'business', 'individual'] as const).map((t) => {
          const isSelected = selectedType === t;
          const label = t === 'all' ? 'All Parties' : t === 'business' ? 'B2B (GST Registered)' : 'B2C (Retail)';
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedType(t)}
              style={[styles.segmentBtn, isSelected ? styles.segmentBtnActive : null]}
            >
              <Text style={[styles.segmentText, isSelected ? styles.segmentTextActive : null]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Customer List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0A0A0A" />
          <Text style={styles.loadingText}>Loading customers directory...</Text>
        </View>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id || (item as any)._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0A0A0A" />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>No Customers Found</Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'No party matches your search criteria.' : 'Add your first trade customer or business party.'}
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/customers/create')}
              >
                <Text style={styles.emptyBtnText}>+ Add Customer</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const isB2B = item.customerType === 'business' || Boolean(item.gstin);
            return (
              <TouchableOpacity
                style={styles.customerCard}
                activeOpacity={0.88}
                onPress={() => router.push(`/customers/${item.id || (item as any)._id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.custName}>{item.name}</Text>
                      <View style={[styles.typePill, isB2B ? styles.typePillB2B : styles.typePillB2C]}>
                        <Text style={[styles.typePillText, isB2B ? styles.typeTextB2B : styles.typeTextB2C]}>
                          {isB2B ? 'B2B Trade' : 'Retail'}
                        </Text>
                      </View>
                    </View>
                    {item.businessName && item.businessName !== item.name ? (
                      <Text style={styles.businessSub}>{item.businessName}</Text>
                    ) : null}
                  </View>
                </View>

                {/* Contact & GST Details */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mobile:</Text>
                    <Text style={styles.detailVal}>{item.mobile}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>State:</Text>
                    <Text style={styles.detailVal}>{item.state || 'Gujarat'}</Text>
                  </View>
                  {item.gstin ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>GSTIN:</Text>
                      <Text style={[styles.detailVal, styles.gstinVal]}>{item.gstin}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Quick Action Buttons */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCall(item.mobile)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.callBtnText}>📞 Call Party</Text>
                  </TouchableOpacity>

                  <View style={styles.rightActions}>
                    <TouchableOpacity
                      style={styles.billBtn}
                      onPress={() => router.push(`/items/create?partyName=${encodeURIComponent(item.name)}&partyMobile=${encodeURIComponent(item.mobile)}&partyState=${encodeURIComponent(item.state || 'Gujarat')}&partyGstin=${encodeURIComponent(item.gstin || '')}` as any)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.billBtnText}>+ Create Bill</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => router.push(`/customers/edit/${item.id || (item as any)._id}` as any)}
                    >
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  addHeaderBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0A0A0A',
    padding: 0,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#68728A',
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#0A0A0A',
    borderColor: '#0A0A0A',
  },
  segmentText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#525866',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E9F0',
    ...Platform.select({
      ios: {
        shadowColor: '#101226',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  custName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0A0A',
    flex: 1,
  },
  businessSub: {
    fontSize: 11.5,
    color: '#68728A',
    marginTop: 2,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typePillB2B: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  typePillB2C: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  typeTextB2B: {
    color: '#6D28D9',
  },
  typeTextB2C: {
    color: '#475569',
  },
  detailsBox: {
    backgroundColor: '#F8F9FC',
    borderRadius: 10,
    padding: 10,
    gap: 4,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 11,
    color: '#68728A',
    fontWeight: '600',
  },
  detailVal: {
    fontSize: 11.5,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  gstinVal: {
    color: '#166534',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F3F7',
  },
  callBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  billBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  billBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editBtn: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#525866',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#68728A',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#68728A',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
