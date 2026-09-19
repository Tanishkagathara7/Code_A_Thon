import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { customerApi } from '../../../services/api/customerApi';
import { AppHeader } from '../../../components/navigation/AppHeader';
import { useToast } from '../../../context/ToastContext';

const INDIAN_STATES = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Telangana',
];

export default function EditCustomerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState<'business' | 'individual'>('business');
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      try {
        const res = await customerApi.getCustomer(id);
        if (res?.data?.customer) {
          const c = res.data.customer;
          setName(c.name || '');
          setMobile(c.mobile || '');
          setEmail(c.email || '');
          setCustomerType(c.customerType || 'business');
          setGstin(c.gstin || '');
          setBusinessName(c.businessName || '');
          setAddress(c.address || '');
          setCity(c.city || '');
          setState(c.state || 'Gujarat');
          setPincode(c.pincode || '');
          setNotes(c.notes || '');
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch customer', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      showToast('Party / Customer name is required', 'error');
      return;
    }
    const cleanedMobile = mobile.replace(/[\s\-+]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      showToast('Valid 10-digit Indian mobile number is required', 'error');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Valid email address is required', 'error');
      return;
    }
    if (gstin.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.trim().toUpperCase())) {
      showToast('Invalid 15-character GSTIN format', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await customerApi.updateCustomer(id as string, {
        name: name.trim(),
        mobile: cleanedMobile,
        email: email.trim() || undefined,
        customerType,
        gstin: gstin.trim().toUpperCase() || undefined,
        businessName: businessName.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state,
        pincode: pincode.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      showToast('Customer updated successfully', 'success');
      router.back();
    } catch (err: any) {
      showToast(err.message || 'Failed to update customer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Edit Party / Customer"
        subtitle={name}
        onBack={() => router.back()}
        backText="Cancel"
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0A0A0A" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Party Type</Text>
              <View style={styles.typeToggleRow}>
                <TouchableOpacity
                  onPress={() => setCustomerType('business')}
                  style={[styles.typeBtn, customerType === 'business' ? styles.typeBtnActive : null]}
                >
                  <Text style={[styles.typeBtnText, customerType === 'business' ? styles.typeBtnTextActive : null]}>
                    🏢 B2B Commercial
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCustomerType('individual')}
                  style={[styles.typeBtn, customerType === 'individual' ? styles.typeBtnActive : null]}
                >
                  <Text style={[styles.typeBtnText, customerType === 'individual' ? styles.typeBtnTextActive : null]}>
                    👤 Individual / Retail
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Contact & Business Details</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Party / Customer Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {customerType === 'business' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Business / Firm Name</Text>
                  <TextInput
                    style={styles.input}
                    value={businessName}
                    onChangeText={setBusinessName}
                  />
                </View>
              )}

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={setMobile}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>GSTIN</Text>
                <TextInput
                  style={[styles.input, { textTransform: 'uppercase' }]}
                  autoCapitalize="characters"
                  maxLength={15}
                  value={gstin}
                  onChangeText={setGstin}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>State & Address</Text>

              <View style={styles.field}>
                <Text style={styles.label}>State</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                  {INDIAN_STATES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setState(s)}
                      style={[styles.chip, state === s ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, state === s ? styles.chipTextActive : null]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={6}
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleUpdate}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Update Customer Record</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0A0A0A',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  typeToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#0A0A0A',
    borderColor: '#0A0A0A',
  },
  typeBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#525866',
    textAlign: 'center',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F3F7',
  },
  chipActive: {
    backgroundColor: '#0A0A0A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#525866',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
