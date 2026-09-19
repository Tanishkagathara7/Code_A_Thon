import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { productApi } from '../../services/api/productApi';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useToast } from '../../context/ToastContext';

const GST_RATES = [0, 5, 12, 18, 28];
const UNITS = ['piece', 'kg', 'gram', 'litre', 'metre', 'box', 'pack', 'tin'];

export default function CreateProductScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('1006');
  const [category, setCategory] = useState('Grains & Pulses');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('piece');

  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);

  const [gstApplicability, setGstApplicability] = useState<'taxable' | 'exempt' | 'non_gst'>('taxable');
  const [gstRate, setGstRate] = useState<number>(18);

  const [openingStock, setOpeningStock] = useState('0');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [trackInventory, setTrackInventory] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
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
      await productApi.createProduct({
        name: name.trim(),
        sku: sku.trim() || undefined,
        hsnCode: hsnCode.trim() || undefined,
        category: category.trim() || 'General',
        brand: brand.trim() || undefined,
        description: description.trim() || undefined,
        unit: unit as any,
        sellingPrice: sellPriceNum,
        purchasePrice: purchasePrice ? Number(purchasePrice) : 0,
        isTaxInclusive,
        gstApplicability,
        gstRate,
        openingStock: Number(openingStock) || 0,
        currentStock: Number(openingStock) || 0,
        minStockAlert: Number(minStockAlert) || 5,
        trackInventory,
      });

      showToast('Product created successfully', 'success');
      router.back();
    } catch (err: any) {
      showToast(err.message || 'Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Add New Product"
        subtitle="Catalog & GST Rate Configuration"
        onBack={() => router.back()}
        backText="Cancel"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Section 1: Basic Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Basic Information</Text>

            <View style={styles.field}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Basmati Rice 5kg Pack"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>HSN / SAC Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1006"
                  keyboardType="numeric"
                  value={hsnCode}
                  onChangeText={setHsnCode}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>SKU / Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. RICE-01"
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
                  placeholder="e.g. Grains, Oil, FMCG"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Brand</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Fortune"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
            </View>

            {/* Unit Selector */}
            <View style={styles.field}>
              <Text style={styles.label}>Unit of Measurement</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {UNITS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setUnit(u)}
                    style={[styles.chip, unit === u ? styles.chipActive : null]}
                  >
                    <Text style={[styles.chipText, unit === u ? styles.chipTextActive : null]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Section 2: Pricing & Taxation */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2. Pricing & Selling Rate</Text>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>
                  Selling Price (₹) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Cost / Purchase (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Tax-Inclusive Selling Price</Text>
                <Text style={styles.switchSub}>Price includes GST calculation directly</Text>
              </View>
              <Switch value={isTaxInclusive} onValueChange={setIsTaxInclusive} trackColor={{ true: '#10B981' }} />
            </View>
          </View>

          {/* Section 3: GST Configuration */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3. Product-Wise GST Configuration</Text>
            <Text style={styles.fieldHelp}>Select the statutory GST rate applicable to this product:</Text>

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

          {/* Section 4: Stock & Inventory */}
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>4. Inventory Management</Text>
                <Text style={styles.switchSub}>Track real-time stock deductions on bill generation</Text>
              </View>
              <Switch value={trackInventory} onValueChange={setTrackInventory} trackColor={{ true: '#10B981' }} />
            </View>

            {trackInventory && (
              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Opening Stock</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={openingStock}
                    onChangeText={setOpeningStock}
                  />
                </View>

                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Low Stock Reorder Alert</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="5"
                    keyboardType="numeric"
                    value={minStockAlert}
                    onChangeText={setMinStockAlert}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Save Product to Inventory</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  required: {
    color: '#EF4444',
  },
  fieldHelp: {
    fontSize: 11.5,
    color: '#68728A',
    marginBottom: 10,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A0A',
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
