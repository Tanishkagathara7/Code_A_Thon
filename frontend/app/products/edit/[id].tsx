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
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { productApi } from '../../../services/api/productApi';
import { AppHeader } from '../../../components/navigation/AppHeader';
import { useToast } from '../../../context/ToastContext';

const GST_RATES = [0, 5, 12, 18, 28];
const UNITS = ['piece', 'kg', 'gram', 'litre', 'metre', 'box', 'pack', 'tin'];

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('1006');
  const [category, setCategory] = useState('General');
  const [brand, setBrand] = useState('');
  const [unit, setUnit] = useState('piece');

  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);

  const [gstApplicability, setGstApplicability] = useState<'taxable' | 'exempt' | 'non_gst'>('taxable');
  const [gstRate, setGstRate] = useState<number>(18);

  const [minStockAlert, setMinStockAlert] = useState('5');
  const [trackInventory, setTrackInventory] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await productApi.getProduct(id);
        if (res?.data) {
          const p = res.data;
          setName(p.name || '');
          setSku(p.sku || '');
          setHsnCode(p.hsnCode || '1006');
          setCategory(p.category || 'General');
          setBrand(p.brand || '');
          setUnit(p.unit || 'piece');
          setSellingPrice(String(p.sellingPrice || ''));
          setPurchasePrice(String(p.purchasePrice || '0'));
          setIsTaxInclusive(Boolean(p.isTaxInclusive));
          setGstApplicability(p.gstApplicability || 'taxable');
          setGstRate(p.gstRate ?? 18);
          setMinStockAlert(String(p.minStockAlert ?? 5));
          setTrackInventory(p.trackInventory !== false);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch product details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    const sellPriceNum = Number(sellingPrice);
    if (isNaN(sellPriceNum) || sellPriceNum <= 0) {
      showToast('Valid selling price greater than 0 is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await productApi.updateProduct(id as string, {
        name: name.trim(),
        sku: sku.trim() || undefined,
        hsnCode: hsnCode.trim() || undefined,
        category: category.trim() || 'General',
        brand: brand.trim() || undefined,
        unit: unit as any,
        sellingPrice: sellPriceNum,
        purchasePrice: purchasePrice ? Number(purchasePrice) : 0,
        isTaxInclusive,
        gstApplicability,
        gstRate,
        minStockAlert: Number(minStockAlert) || 5,
        trackInventory,
      });

      showToast('Product updated successfully', 'success');
      router.back();
    } catch (err: any) {
      showToast(err.message || 'Failed to update product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Edit Product"
        subtitle="Modify Product & GST Rules"
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
              <Text style={styles.sectionTitle}>1. Basic Information</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>HSN / SAC Code</Text>
                  <TextInput
                    style={styles.input}
                    value={hsnCode}
                    onChangeText={setHsnCode}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>SKU</Text>
                  <TextInput
                    style={styles.input}
                    value={sku}
                    onChangeText={setSku}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>2. Pricing & Selling Rate</Text>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Selling Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Purchase Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                  />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>3. GST Rate Configuration</Text>
              <View style={styles.gstSlabsRow}>
                {GST_RATES.map((rate) => {
                  const isSelected = gstRate === rate;
                  return (
                    <TouchableOpacity
                      key={rate}
                      onPress={() => setGstRate(rate)}
                      style={[styles.gstSlabBtn, isSelected ? styles.gstSlabBtnActive : null]}
                    >
                      <Text style={[styles.gstSlabText, isSelected ? styles.gstSlabTextActive : null]}>
                        {rate}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>4. Inventory Tracking</Text>
                  <Text style={styles.switchSub}>Track real-time stock deductions on bill generation</Text>
                </View>
                <Switch value={trackInventory} onValueChange={setTrackInventory} trackColor={{ true: '#10B981' }} />
              </View>

              {trackInventory && (
                <View style={styles.field}>
                  <Text style={styles.label}>Low Stock Alert Threshold</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={minStockAlert}
                    onChangeText={setMinStockAlert}
                  />
                </View>
              )}
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
                <Text style={styles.submitBtnText}>Update Product</Text>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchSub: {
    fontSize: 11,
    color: '#68728A',
    marginTop: 2,
  },
  gstSlabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gstSlabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    alignItems: 'center',
  },
  gstSlabBtnActive: {
    backgroundColor: '#0A0A0A',
    borderColor: '#0A0A0A',
  },
  gstSlabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#525866',
  },
  gstSlabTextActive: {
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
