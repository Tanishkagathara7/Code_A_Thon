import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { customerApi } from '../../services/api/customerApi';
import { CustomerProfileData } from '../../types/domain';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useToast } from '../../context/ToastContext';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await customerApi.getCustomer(id);
        if (res?.data) {
          setProfile(res.data);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch customer profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0A0A0A" />
      </View>
    );
  }

  if (!profile || !profile.customer) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Customer profile not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { customer, stats, invoices } = profile;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Customer Profile"
        subtitle={customer.name}
        onBack={() => router.back()}
        backText="Parties"
        rightAction={
          <TouchableOpacity
            style={styles.editHeaderBtn}
            onPress={() => router.push(`/customers/edit/${customer.id || (customer as any)._id}` as any)}
          >
            <Text style={styles.editHeaderBtnText}>Edit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Customer Identity Card */}
        <View style={styles.card}>
          <View style={styles.partyHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.partyName}>{customer.name}</Text>
              {customer.businessName && (
                <Text style={styles.businessName}>{customer.businessName}</Text>
              )}
            </View>
            <View style={[styles.typeBadge, customer.gstin ? styles.b2bBadge : styles.b2cBadge]}>
              <Text style={[styles.typeBadgeText, customer.gstin ? styles.b2bText : styles.b2cText]}>
                {customer.gstin ? 'B2B Trade' : 'Retail Customer'}
              </Text>
            </View>
          </View>

          <View style={styles.contactDetailsBox}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mobile</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${customer.mobile}`)}>
                <Text style={styles.phoneLink}>📞 {customer.mobile}</Text>
              </TouchableOpacity>
            </View>
            {customer.email ? (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{customer.email}</Text>
              </View>
            ) : null}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>State (Place of Supply)</Text>
              <Text style={styles.detailValue}>{customer.state || 'Gujarat'}</Text>
            </View>
            {customer.gstin ? (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>GSTIN</Text>
                <Text style={[styles.detailValue, styles.gstinValue]}>{customer.gstin}</Text>
              </View>
            ) : null}
            {customer.address ? (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>
                  {[customer.address, customer.city, customer.pincode].filter(Boolean).join(', ')}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Quick Create Bill for this Customer */}
          <TouchableOpacity
            style={styles.createBillBtn}
            onPress={() =>
              router.push(
                `/items/create?partyName=${encodeURIComponent(customer.name)}&partyMobile=${encodeURIComponent(customer.mobile)}&partyState=${encodeURIComponent(customer.state || 'Gujarat')}&partyGstin=${encodeURIComponent(customer.gstin || '')}` as any
              )
            }
          >
            <Text style={styles.createBillBtnText}>+ Create Tax Bill for {customer.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Khata / Financial Metrics */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL BILLED</Text>
            <Text style={styles.statVal}>₹{Number(stats.totalBilled || 0).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL INVOICES</Text>
            <Text style={styles.statVal}>{stats.totalInvoices || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statLabel, { color: stats.pendingBalance > 0 ? '#B45309' : '#16A34A' }]}>
              BALANCE DUE
            </Text>
            <Text style={[styles.statVal, { color: stats.pendingBalance > 0 ? '#B45309' : '#16A34A' }]}>
              ₹{Number(stats.pendingBalance || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Linked Invoices Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Invoice History</Text>
          {invoices.length === 0 ? (
            <Text style={styles.noInvoicesText}>No invoices have been billed to this customer yet.</Text>
          ) : (
            <View style={styles.invoicesList}>
              {invoices.map((inv) => (
                <TouchableOpacity
                  key={inv.id}
                  style={styles.invoiceItem}
                  onPress={() => router.push(`/items/${inv.id}` as any)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invNo}>{inv.invoiceNo}</Text>
                    <Text style={styles.invDate}>
                      {new Date(inv.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invAmount}>₹{Number(inv.grandTotal).toLocaleString('en-IN')}</Text>
                    <Text
                      style={[
                        styles.invStatus,
                        inv.paymentStatus === 'Paid in Full' ? styles.statusPaid : styles.statusUnpaid,
                      ]}
                    >
                      {inv.paymentStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#68728A',
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  editHeaderBtn: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  partyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partyName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  businessName: {
    fontSize: 13,
    color: '#68728A',
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  b2bBadge: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  b2cBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  b2bText: {
    color: '#6D28D9',
  },
  b2cText: {
    color: '#475569',
  },
  contactDetailsBox: {
    backgroundColor: '#F8F9FC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#68728A',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  phoneLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  gstinValue: {
    color: '#166534',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  createBillBtn: {
    backgroundColor: '#0A0A0A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  createBillBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#68728A',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0A0A0A',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 12,
  },
  noInvoicesText: {
    fontSize: 12.5,
    color: '#68728A',
    fontStyle: 'italic',
  },
  invoicesList: {
    gap: 10,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F3F7',
  },
  invNo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  invDate: {
    fontSize: 11,
    color: '#68728A',
    marginTop: 2,
  },
  invAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  invStatus: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },
  statusPaid: {
    color: '#16A34A',
  },
  statusUnpaid: {
    color: '#D97706',
  },
});
