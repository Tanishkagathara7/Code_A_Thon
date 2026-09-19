import React, { useState, useEffect, useMemo } from 'react';
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
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { hackathonItemApi } from '../../services/api/hackathonItemApi';
import { productApi } from '../../services/api/productApi';
import { customerApi } from '../../services/api/customerApi';
import { ProductItem, CustomerRecord } from '../../types/domain';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useToast } from '../../context/ToastContext';

interface InvoiceLineItem {
  id: string;
  productId?: string;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  gstRate: number;
  availableStock?: number;
}

export default function MobileCreateBillScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    partyName?: string;
    partyMobile?: string;
    partyState?: string;
    partyGstin?: string;
  }>();
  const { showToast } = useToast();

  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>([]);
  const [savedCustomers, setSavedCustomers] = useState<CustomerRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Business Profile Info (Seller state is Gujarat by default)
  const sellerState = 'Gujarat';

  // Customer / Party Info
  const [partyName, setPartyName] = useState(searchParams.partyName || '');
  const [partyMobile, setPartyMobile] = useState(searchParams.partyMobile || '');
  const [partyState, setPartyState] = useState(searchParams.partyState || 'Gujarat');
  const [partyGstin, setPartyGstin] = useState(searchParams.partyGstin || '');
  const [paymentStatus, setPaymentStatus] = useState<'Paid in Full' | 'Partial Balance' | 'Unpaid / Due'>('Paid in Full');

  // Customer Selector Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  // Product Picker Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeLineItemIndex, setActiveLineItemIndex] = useState<number | null>(null);

  // Invoice Line Items
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item_1',
      name: 'Basmati Rice Premium (25kg Bag)',
      hsn: '1006',
      qty: 1,
      unit: 'pack',
      rate: 1850,
      gstRate: 5,
    },
  ]);

  // Load Catalog & Customers
  useEffect(() => {
    const init = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          productApi.getProducts({ limit: 100 }),
          customerApi.getCustomers({ limit: 100 }),
        ]);
        if (prodRes?.data) setCatalogProducts(prodRes.data);
        if (custRes?.data) setSavedCustomers(custRes.data);
      } catch (err) {
        console.warn('Failed loading products/customers for billing', err);
      } finally {
        setLoadingData(false);
      }
    };
    init();
  }, []);

  // Determine Inter-state vs Intra-state place of supply
  const isInterState = useMemo(() => {
    return partyState.trim().toLowerCase() !== sellerState.toLowerCase();
  }, [partyState, sellerState]);

  // Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    items.forEach((item) => {
      const lineTaxable = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const lineTax = (lineTaxable * (Number(item.gstRate) || 0)) / 100;
      subtotal += lineTaxable;

      if (isInterState) {
        igstTotal += lineTax;
      } else {
        cgstTotal += lineTax / 2;
        sgstTotal += lineTax / 2;
      }
    });

    const totalTax = isInterState ? igstTotal : cgstTotal + sgstTotal;
    const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      cgstTotal: Math.round(cgstTotal * 100) / 100,
      sgstTotal: Math.round(sgstTotal * 100) / 100,
      igstTotal: Math.round(igstTotal * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      grandTotal,
    };
  }, [items, isInterState]);

  // Add line item
  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}`,
        name: '',
        hsn: '9983',
        qty: 1,
        unit: 'piece',
        rate: 0,
        gstRate: 18,
      },
    ]);
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    if (items.length <= 1) {
      showToast('Bill must have at least one line item', 'info');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update line item
  const updateLineItem = (index: number, updates: Partial<InvoiceLineItem>) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Pick customer from list
  const selectCustomer = (cust: CustomerRecord) => {
    setPartyName(cust.name);
    setPartyMobile(cust.mobile);
    setPartyState(cust.state || 'Gujarat');
    setPartyGstin(cust.gstin || '');
    setCustomerModalOpen(false);
  };

  // Pick product for line item
  const selectProductForLine = (prod: ProductItem) => {
    if (activeLineItemIndex !== null) {
      updateLineItem(activeLineItemIndex, {
        productId: prod.id || (prod as any)._id,
        name: prod.name,
        hsn: prod.hsnCode || '1006',
        rate: prod.sellingPrice,
        unit: prod.unit || 'piece',
        gstRate: prod.gstRate ?? 18,
        availableStock: prod.currentStock,
      });
    }
    setProductModalOpen(false);
    setActiveLineItemIndex(null);
  };

  // Finalize Invoice & Save
  const handleFinalizeBill = async () => {
    if (!partyName.trim()) {
      showToast('Customer / Party name is required', 'error');
      return;
    }

    // Check invalid items
    for (const it of items) {
      if (!it.name.trim()) {
        showToast('All items must have a name or description', 'error');
        return;
      }
      if (it.qty <= 0) {
        showToast(`Quantity for "${it.name}" must be greater than 0`, 'error');
        return;
      }
      if (it.rate < 0) {
        showToast(`Rate for "${it.name}" cannot be negative`, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      title: `${invoiceNo} • ${partyName.trim()}`,
      description: `Tax Invoice for ₹${calculations.grandTotal.toLocaleString('en-IN')} (${paymentStatus}). Items: ${items.length}.`,
      category: partyState,
      status: paymentStatus === 'Paid in Full' ? 'completed' : paymentStatus === 'Partial Balance' ? 'in_progress' : 'pending',
      priority: isInterState ? 'high' : 'medium',
      attributes: {
        invoiceNo,
        invoiceDate: new Date().toISOString(),
        party: {
          name: partyName.trim(),
          mobile: partyMobile.trim(),
          state: partyState,
          gstin: partyGstin.trim() || undefined,
        },
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          hsn: it.hsn,
          qty: it.qty,
          unit: it.unit,
          rate: it.rate,
          gstRate: it.gstRate,
          totalAmount: Math.round(it.qty * it.rate * (1 + it.gstRate / 100) * 100) / 100,
        })),
        subtotal: calculations.subtotal,
        isInterState,
        cgstTotal: calculations.cgstTotal,
        sgstTotal: calculations.sgstTotal,
        igstTotal: calculations.igstTotal,
        totalTax: calculations.totalTax,
        grandTotal: calculations.grandTotal,
        paymentStatus,
        business: {
          name: 'Shreeji General Store',
          gstin: '24AAACP1234M1Z5',
          state: sellerState,
        },
      },
    };

    try {
      const res = await hackathonItemApi.createItem(payload as any);

      // Decrement stock for tracked products
      items.forEach((it) => {
        if (it.productId) {
          productApi.adjustStock(
            it.productId,
            'decrease',
            it.qty,
            `Billed in Invoice ${invoiceNo}`
          ).catch((e) => console.warn('Stock update deferred', e));
        }
      });

      showToast(`Tax invoice ${invoiceNo} generated!`, 'success');
      if (res.data?.id) {
        router.replace(`/items/${res.data.id}`);
      } else {
        router.replace('/items');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate tax invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppHeader
        title="Create Tax Bill"
        subtitle="GST POS Counter & Invoice Generator"
        onBack={() => router.back()}
        backText="Cancel"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Statutory Place of Supply & Tax Mode Indicator */}
          <View style={[styles.posBanner, isInterState ? styles.posBannerInter : styles.posBannerIntra]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.posBannerTitle}>
                {isInterState ? 'INTER-STATE SUPPLY (IGST 100%)' : 'INTRA-STATE SUPPLY (CGST 50% + SGST 50%)'}
              </Text>
              <Text style={styles.posBannerSub}>
                Seller: {sellerState} ➔ Customer: {partyState || 'Gujarat'}
              </Text>
            </View>
          </View>

          {/* Section 1: Customer / Billed To */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>1. Billed To (Customer / Party)</Text>
              <TouchableOpacity
                style={styles.selectCustBtn}
                onPress={() => setCustomerModalOpen(true)}
              >
                <Text style={styles.selectCustBtnText}>🔍 Saved Customers</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Customer / Business Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rajesh Traders or Walk-in Retail"
                value={partyName}
                onChangeText={setPartyName}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9825123456"
                  keyboardType="phone-pad"
                  value={partyMobile}
                  onChangeText={setPartyMobile}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Customer State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Gujarat"
                  value={partyState}
                  onChangeText={setPartyState}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>GSTIN (If Registered B2B Party)</Text>
              <TextInput
                style={[styles.input, { textTransform: 'uppercase' }]}
                placeholder="e.g. 24AABCT1357Q1ZP"
                autoCapitalize="characters"
                maxLength={15}
                value={partyGstin}
                onChangeText={setPartyGstin}
              />
            </View>
          </View>

          {/* Section 2: Line Items */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>2. Itemized Products</Text>
              <TouchableOpacity style={styles.addItemBtn} onPress={addLineItem}>
                <Text style={styles.addItemBtnText}>+ Add Line Item</Text>
              </TouchableOpacity>
            </View>

            {items.map((item, index) => {
              const lineTaxable = (item.qty || 0) * (item.rate || 0);
              const lineTax = (lineTaxable * (item.gstRate || 0)) / 100;
              const lineTotal = lineTaxable + lineTax;

              return (
                <View key={item.id} style={styles.itemBox}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemIndexText}>Item #{index + 1}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        style={styles.catalogPickBtn}
                        onPress={() => {
                          setActiveLineItemIndex(index);
                          setProductModalOpen(true);
                        }}
                      >
                        <Text style={styles.catalogPickText}>📦 Pick Catalog</Text>
                      </TouchableOpacity>
                      {items.length > 1 && (
                        <TouchableOpacity onPress={() => removeLineItem(index)}>
                          <Text style={styles.deleteLineText}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.field}>
                    <TextInput
                      style={styles.input}
                      placeholder="Product Description"
                      value={item.name}
                      onChangeText={(val) => updateLineItem(index, { name: val })}
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>HSN/SAC</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="1006"
                        keyboardType="numeric"
                        value={item.hsn}
                        onChangeText={(val) => updateLineItem(index, { hsn: val })}
                      />
                    </View>

                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>Qty ({item.unit || 'unit'})</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(item.qty)}
                        onChangeText={(val) => updateLineItem(index, { qty: Number(val) || 0 })}
                      />
                    </View>

                    <View style={[styles.field, { flex: 1.2 }]}>
                      <Text style={styles.label}>Rate (₹)</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(item.rate)}
                        onChangeText={(val) => updateLineItem(index, { rate: Number(val) || 0 })}
                      />
                    </View>

                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>GST %</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(item.gstRate)}
                        onChangeText={(val) => updateLineItem(index, { gstRate: Number(val) || 0 })}
                      />
                    </View>
                  </View>

                  {/* Line Total Calculation */}
                  <View style={styles.lineCalculationRow}>
                    <Text style={styles.lineTaxBreakdown}>
                      Tax: ₹{lineTax.toFixed(2)} ({isInterState ? `IGST ${item.gstRate}%` : `CGST ${(item.gstRate/2)}% + SGST ${(item.gstRate/2)}%`})
                    </Text>
                    <Text style={styles.lineTotalVal}>Total: ₹{lineTotal.toFixed(2)}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Section 3: Tax Summary & Final Total */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3. Statutory Tax Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxable Subtotal:</Text>
              <Text style={styles.summaryVal}>₹{calculations.subtotal.toFixed(2)}</Text>
            </View>

            {isInterState ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Integrated GST (IGST 100%):</Text>
                <Text style={styles.summaryVal}>₹{calculations.igstTotal.toFixed(2)}</Text>
              </View>
            ) : (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Central GST (CGST 50%):</Text>
                  <Text style={styles.summaryVal}>₹{calculations.cgstTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>State GST (SGST 50%):</Text>
                  <Text style={styles.summaryVal}>₹{calculations.sgstTotal.toFixed(2)}</Text>
                </View>
              </>
            )}

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL (₹):</Text>
              <Text style={styles.grandTotalVal}>
                ₹{calculations.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Payment Status Toggle */}
            <View style={styles.paymentStatusToggleRow}>
              {(['Paid in Full', 'Partial Balance', 'Unpaid / Due'] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setPaymentStatus(st)}
                  style={[styles.payStatusBtn, paymentStatus === st ? styles.payStatusBtnActive : null]}
                >
                  <Text style={[styles.payStatusText, paymentStatus === st ? styles.payStatusTextActive : null]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Finalize Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleFinalizeBill}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                Finalize & Deduct Stock (₹{calculations.grandTotal.toLocaleString('en-IN')})
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Customer Selection Modal */}
      <Modal visible={customerModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Saved Customer</Text>
              <TouchableOpacity onPress={() => setCustomerModalOpen(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {savedCustomers.map((cust) => (
                <TouchableOpacity
                  key={cust.id || (cust as any)._id}
                  style={styles.modalCustItem}
                  onPress={() => selectCustomer(cust)}
                >
                  <Text style={styles.modalCustName}>{cust.name}</Text>
                  <Text style={styles.modalCustSub}>
                    {cust.mobile} • {cust.state || 'Gujarat'} {cust.gstin ? `• GSTIN: ${cust.gstin}` : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Product Selection Modal */}
      <Modal visible={productModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Catalog Product</Text>
              <TouchableOpacity onPress={() => setProductModalOpen(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {catalogProducts.map((prod) => (
                <TouchableOpacity
                  key={prod.id || (prod as any)._id}
                  style={styles.modalProdItem}
                  onPress={() => selectProductForLine(prod)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalProdName}>{prod.name}</Text>
                    <Text style={styles.modalProdSub}>
                      HSN: {prod.hsnCode} • Stock: {prod.currentStock} {prod.unit}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.modalProdPrice}>₹{prod.sellingPrice}</Text>
                    <Text style={styles.modalProdGst}>{prod.gstRate}% GST</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  posBanner: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  posBannerIntra: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  posBannerInter: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  posBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  posBannerSub: {
    fontSize: 11,
    color: '#525866',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  selectCustBtn: {
    backgroundColor: '#F1F3F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  selectCustBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  addItemBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addItemBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13.5,
    color: '#0A0A0A',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  itemBox: {
    backgroundColor: '#FAFBFD',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#525866',
  },
  catalogPickBtn: {
    backgroundColor: '#F1F3F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catalogPickText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  deleteLineText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  lineCalculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#EDF0F5',
  },
  lineTaxBreakdown: {
    fontSize: 11,
    color: '#68728A',
  },
  lineTotalVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#525866',
  },
  summaryVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderColor: '#E6E9F0',
    paddingTop: 10,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  paymentStatusToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  payStatusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F3F7',
    alignItems: 'center',
  },
  payStatusBtnActive: {
    backgroundColor: '#0A0A0A',
  },
  payStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#525866',
  },
  payStatusTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#0A0A0A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  modalClose: {
    fontSize: 18,
    fontWeight: '800',
    color: '#68728A',
  },
  modalCustItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F3F7',
  },
  modalCustName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  modalCustSub: {
    fontSize: 11.5,
    color: '#68728A',
    marginTop: 2,
  },
  modalProdItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F3F7',
  },
  modalProdName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  modalProdSub: {
    fontSize: 11.5,
    color: '#68728A',
    marginTop: 2,
  },
  modalProdPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  modalProdGst: {
    fontSize: 11,
    color: '#166534',
  },
});
