import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

interface InvoiceLineItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

type TabType = 'billing' | 'parties' | 'products' | 'sales';

export const MobileInteractivePosDesk: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('billing');

  // Interactive line items in the showcase billing desk
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item_1',
      name: 'Basmati Rice 5kg Pack',
      hsn: '1006',
      qty: 10,
      rate: 450,
      gstRate: 5,
    },
    {
      id: 'item_2',
      name: 'Sunflower Refined Oil 1L',
      hsn: '1512',
      qty: 20,
      rate: 140,
      gstRate: 5,
    },
  ]);

  const [counterState, setCounterState] = useState<'normal' | 'printed'>('normal');

  // Compute live calculations
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const totalTax = items.reduce((acc, item) => acc + (item.qty * item.rate * item.gstRate) / 100, 0);
  const grandTotal = subtotal + totalTax;

  // Qty Increment/Decrement
  const adjustQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  return (
    <View style={styles.deviceFrame}>
      {/* Glossy Header Bar with Shop Identity matching Web */}
      <View style={styles.topAppHeader}>
        <View style={styles.shopBrandingRow}>
          <View style={styles.rupeeEmblem}>
            <Text style={styles.rupeeSymbol}>₹</Text>
          </View>
          <View>
            <Text style={styles.shopName}>Shreeji General Store</Text>
            <Text style={styles.gstinCode}>
              GSTIN: 24AAACP1234M1Z5 • Gujarat (State 24)
            </Text>
          </View>
        </View>

        <View style={styles.headerPillsRow}>
          <View style={styles.statusPill}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.statusPillText}>GST Portal Linked</Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>Counter 01</Text>
          </View>
        </View>
      </View>

      {/* Mini Segmented Tabs Bar (Billing Desk, Parties, Products, Sales) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.segmentedBar}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('billing')}
          style={[
            styles.segmentBtn,
            activeTab === 'billing' ? styles.segmentBtnActive : styles.segmentBtnInactive,
          ]}
        >
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'billing' ? styles.segmentTextActive : styles.segmentTextInactive,
            ]}
          >
            📋 Billing Desk
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('parties')}
          style={[
            styles.segmentBtn,
            activeTab === 'parties' ? styles.segmentBtnActive : styles.segmentBtnInactive,
          ]}
        >
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'parties' ? styles.segmentTextActive : styles.segmentTextInactive,
            ]}
          >
            👥 Parties (Khata)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('products')}
          style={[
            styles.segmentBtn,
            activeTab === 'products' ? styles.segmentBtnActive : styles.segmentBtnInactive,
          ]}
        >
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'products' ? styles.segmentTextActive : styles.segmentTextInactive,
            ]}
          >
            📦 Products & HSN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('sales')}
          style={[
            styles.segmentBtn,
            activeTab === 'sales' ? styles.segmentBtnActive : styles.segmentBtnInactive,
          ]}
        >
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'sales' ? styles.segmentTextActive : styles.segmentTextInactive,
            ]}
          >
            📈 Sales & Tax
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Billing Paper Desk / Tab Body */}
      {activeTab === 'billing' ? (
        <View style={styles.billingDeskBody}>
          {/* Bill Meta Row */}
          <View style={styles.billMetaRow}>
            <View>
              <View style={styles.taxInvoiceBadgeGroup}>
                <View style={styles.taxInvoiceBadge}>
                  <Text style={styles.taxInvoiceBadgeText}>TAX INVOICE</Text>
                </View>
                <Text style={styles.invoiceNumber}>#INV-2026-0042</Text>
              </View>
              <Text style={styles.billedToText}>
                Billed To: <Text style={styles.partyBold}>Rajesh Traders</Text>
              </Text>
              <Text style={styles.billedToSub}>
                GSTIN: 24AABCT1357Q1ZP • Gujarat
              </Text>
            </View>

            <View style={styles.taxTypePill}>
              <Text style={styles.taxTypePillText}>
                Intra-State (CGST 2.5% + SGST 2.5%)
              </Text>
            </View>
          </View>

          {/* Interactive Itemized Table */}
          <View style={styles.itemsTableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.colHeader, { flex: 2.5 }]}>Item Description</Text>
              <Text style={[styles.colHeader, { flex: 1.2, textAlign: 'center' }]}>HSN</Text>
              <Text style={[styles.colHeader, { flex: 1.6, textAlign: 'center' }]}>Qty (Tap)</Text>
              <Text style={[styles.colHeader, { flex: 1.8, textAlign: 'right' }]}>Total (₹)</Text>
            </View>

            {items.map((item) => {
              const lineTaxable = item.qty * item.rate;
              const lineTax = (lineTaxable * item.gstRate) / 100;
              const lineTotal = lineTaxable + lineTax;

              return (
                <View key={item.id} style={styles.tableItemRow}>
                  <View style={{ flex: 2.5 }}>
                    <Text style={styles.itemTitleText}>{item.name}</Text>
                    <Text style={styles.itemRateText}>
                      ₹{item.rate} @ {item.gstRate}% GST
                    </Text>
                  </View>

                  <Text style={[styles.itemHsnText, { flex: 1.2, textAlign: 'center' }]}>
                    {item.hsn}
                  </Text>

                  {/* Interactive Qty Counter */}
                  <View style={[styles.qtyControlBox, { flex: 1.6 }]}>
                    <TouchableOpacity
                      onPress={() => adjustQty(item.id, -1)}
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValueText}>{item.qty}</Text>
                    <TouchableOpacity
                      onPress={() => adjustQty(item.id, 1)}
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1.8, alignItems: 'flex-end' }}>
                    <Text style={styles.itemTotalAmount}>
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.itemTaxBreakdown}>
                      Tax: ₹{lineTax.toFixed(0)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Amount In Words */}
          <View style={styles.wordsRow}>
            <Text style={styles.wordsLabel}>Amount in words: </Text>
            <Text style={styles.wordsValue}>
              {grandTotal === 7665
                ? 'Seven Thousand Six Hundred Sixty-Five Rupees Only'
                : `Rupees ${grandTotal.toLocaleString('en-IN')} Only`}
            </Text>
          </View>

          {/* Footer Total and Actions */}
          <View style={styles.invoiceFooterRow}>
            <View>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL (INCL. TAXES)</Text>
              <Text style={styles.grandTotalValue}>
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.actionBtnGroup}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setCounterState('printed');
                  router.push('/items/create');
                }}
                style={styles.printInvoiceBtn}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M6 9V2H18V9M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18M6 14H18V22H6V14Z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.printInvoiceBtnText}>
                  {counterState === 'printed' ? 'Bill Saved ✓' : 'Print Tax Invoice'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : activeTab === 'parties' ? (
        <View style={styles.altTabCard}>
          <Text style={styles.altTabTitle}>Customer & Khata Registry</Text>
          <Text style={styles.altTabSubtitle}>
            Direct ledger sync with 14 active trade parties. Tap to bill immediately:
          </Text>
          <View style={styles.presetPartyList}>
            <TouchableOpacity
              style={styles.partyItem}
              onPress={() => router.push('/items/create')}
            >
              <Text style={styles.partyItemTitle}>Rajesh Traders (Gujarat)</Text>
              <Text style={styles.partyItemGstin}>GSTIN: 24AABCT1357Q1ZP • ₹14,200 balance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.partyItem}
              onPress={() => router.push('/items/create')}
            >
              <Text style={styles.partyItemTitle}>Shreeji Electronics (Gujarat)</Text>
              <Text style={styles.partyItemGstin}>GSTIN: 24AABCS9876K1Z3 • Paid in Full</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.partyItem}
              onPress={() => router.push('/items/create')}
            >
              <Text style={styles.partyItemTitle}>Mumbai Textile Syndicate (Maharashtra)</Text>
              <Text style={styles.partyItemGstin}>GSTIN: 27AAACT9012L1Z4 • Inter-State (IGST)</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : activeTab === 'products' ? (
        <View style={styles.altTabCard}>
          <Text style={styles.altTabTitle}>Product Catalog & HSN Master</Text>
          <Text style={styles.altTabSubtitle}>
            Pre-configured retail grocery & electrical items with verified GST rates:
          </Text>
          <View style={styles.presetPartyList}>
            <View style={styles.partyItem}>
              <Text style={styles.partyItemTitle}>Basmati Rice (25kg Bag) • HSN 1006</Text>
              <Text style={styles.partyItemGstin}>Rate: ₹1,850.00 • 5% GST Slabs</Text>
            </View>
            <View style={styles.partyItem}>
              <Text style={styles.partyItemTitle}>Sunflower Refined Oil (15L Tin) • HSN 1512</Text>
              <Text style={styles.partyItemGstin}>Rate: ₹2,750.00 • 5% GST Slabs</Text>
            </View>
            <View style={styles.partyItem}>
              <Text style={styles.partyItemTitle}>Electrical LED Tube 20W • HSN 8539</Text>
              <Text style={styles.partyItemGstin}>Rate: ₹1,450.00 • 18% GST Slabs</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.altTabCard}>
          <Text style={styles.altTabTitle}>Today&apos;s Collection & Tax Split</Text>
          <Text style={styles.altTabSubtitle}>
            Fiscal Year 2025-26 active reconciliation:
          </Text>
          <View style={styles.taxSplitRow}>
            <View style={styles.taxBox}>
              <Text style={styles.taxBoxLabel}>TODAY&apos;S SALES</Text>
              <Text style={styles.taxBoxValue}>₹48,920.00</Text>
              <Text style={styles.taxBoxSub}>18 bills generated</Text>
            </View>
            <View style={styles.taxBox}>
              <Text style={styles.taxBoxLabel}>TOTAL GST</Text>
              <Text style={styles.taxBoxValue}>₹4,650.00</Text>
              <Text style={styles.taxBoxSub}>CGST ₹2,325 + SGST ₹2,325</Text>
            </View>
          </View>
        </View>
      )}

      {/* Floating Bottom Quick Stat Bar */}
      <View style={styles.bottomQuickStatBar}>
        <View>
          <Text style={styles.todayStatLabel}>TODAY&apos;S COLLECTION</Text>
          <Text style={styles.todayStatValue}>₹48,920.00</Text>
          <Text style={styles.todayStatCount}>18 bills generated</Text>
        </View>
        <TouchableOpacity
          style={styles.newBillBtn}
          onPress={() => router.push('/items/create')}
          activeOpacity={0.8}
        >
          <Text style={styles.newBillBtnText}>+ Create New Bill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceFrame: {
    backgroundColor: '#1E242B',
    borderRadius: 22,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#333D48',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      default: {
        filter: 'drop-shadow(0px 6px 16px rgba(0, 0, 0, 0.2))',
      },
    }),
  },
  topAppHeader: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E9',
  },
  shopBrandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  rupeeEmblem: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeSymbol: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A0A0A',
    letterSpacing: -0.2,
  },
  gstinCode: {
    fontSize: 10,
    color: '#525866',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  headerPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F7',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F8F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  counterBadge: {
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  counterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#525866',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  segmentedBar: {
    backgroundColor: '#FAF9F5',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E9',
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#0A0A0A',
  },
  segmentBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    color: '#525866',
  },
  billingDeskBody: {
    backgroundColor: '#FFFDF8',
    padding: 12,
  },
  billMetaRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E9',
    paddingBottom: 10,
    marginBottom: 10,
    gap: 6,
  },
  taxInvoiceBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  taxInvoiceBadge: {
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  taxInvoiceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333D48',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  billedToText: {
    fontSize: 11,
    color: '#525866',
  },
  partyBold: {
    fontWeight: '800',
    color: '#0A0A0A',
  },
  billedToSub: {
    fontSize: 10,
    color: '#68728A',
    marginTop: 1,
  },
  taxTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F8F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 4,
  },
  taxTypePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  itemsTableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E4E9',
    overflow: 'hidden',
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F7F5EF',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E9',
  },
  colHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#525866',
    letterSpacing: 0.2,
  },
  tableItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F7',
  },
  itemTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  itemRateText: {
    fontSize: 9.5,
    color: '#68728A',
    marginTop: 2,
  },
  itemHsnText: {
    fontSize: 10,
    color: '#68728A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  qtyControlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  qtyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0A0A0A',
    lineHeight: 14,
  },
  qtyValueText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A0A0A',
    minWidth: 18,
    textAlign: 'center',
  },
  itemTotalAmount: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0A0A0A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  itemTaxBreakdown: {
    fontSize: 9,
    color: '#16A34A',
    marginTop: 1,
  },
  wordsRow: {
    backgroundColor: '#FAF9F5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  wordsLabel: {
    fontSize: 9.5,
    color: '#68728A',
  },
  wordsValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333D48',
    fontStyle: 'italic',
    marginTop: 2,
  },
  invoiceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  grandTotalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#68728A',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0A0A0A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  printInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  printInvoiceBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  altTabCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  altTabTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  altTabSubtitle: {
    fontSize: 11,
    color: '#68728A',
    marginBottom: 12,
    lineHeight: 16,
  },
  presetPartyList: {
    gap: 8,
  },
  partyItem: {
    backgroundColor: '#FAF9F5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  partyItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  partyItemGstin: {
    fontSize: 10,
    color: '#68728A',
    marginTop: 2,
  },
  taxSplitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  taxBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E4E9',
  },
  taxBoxLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#68728A',
  },
  taxBoxValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A0A0A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginVertical: 4,
  },
  taxBoxSub: {
    fontSize: 9,
    color: '#16A34A',
    fontWeight: '600',
  },
  bottomQuickStatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E4E9',
  },
  todayStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#868C98',
  },
  todayStatValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0A0A0A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  todayStatCount: {
    fontSize: 9.5,
    color: '#16A34A',
    fontWeight: '700',
  },
  newBillBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newBillBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
