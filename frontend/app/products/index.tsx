import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { productApi } from '../../services/api/productApi';
import { ProductItem, ProductSummary, StockStatus } from '../../types/domain';
import { AppHeader } from '../../components/navigation/AppHeader';
import { useToast } from '../../context/ToastContext';
import { useNetwork } from '../../context/NetworkContext';

const GST_RATES = ['all', '0', '5', '12', '18', '28'];

export default function ProductsListScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isOffline } = useNetwork();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [summary, setSummary] = useState<ProductSummary>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGst, setSelectedGst] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<StockStatus | 'all'>('all');

  // Adjust Stock Modal State
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ProductItem | null>(null);
  const [adjustOp, setAdjustOp] = useState<'increase' | 'decrease'>('increase');
  const [adjustQty, setAdjustQty] = useState('1');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const fetchProductsAndSummary = useCallback(async () => {
    try {
      const [prodRes, sumRes] = await Promise.all([
        productApi.getProducts({
          search: search.trim() || undefined,
          gstRate: selectedGst !== 'all' ? Number(selectedGst) : undefined,
          stockStatus: selectedStockStatus !== 'all' ? selectedStockStatus : undefined,
        }),
        productApi.getSummary(),
      ]);

      if (prodRes?.data) {
        setProducts(prodRes.data);
      }
      if (sumRes?.data) {
        setSummary(sumRes.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedGst, selectedStockStatus]);

  useEffect(() => {
    setLoading(true);
    fetchProductsAndSummary();
  }, [fetchProductsAndSummary]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProductsAndSummary();
  };

  const openAdjustStock = (prod: ProductItem) => {
    setTargetProduct(prod);
    setAdjustOp('increase');
    setAdjustQty('1');
    setAdjustReason('');
    setAdjustModalVisible(true);
  };

  const submitStockAdjustment = async () => {
    if (!targetProduct) return;
    const qty = Number(adjustQty);
    if (isNaN(qty) || qty <= 0) {
      showToast('Quantity must be a positive number', 'error');
      return;
    }

    setAdjusting(true);
    try {
      const res = await productApi.adjustStock(
        targetProduct.id || (targetProduct as any)._id,
        adjustOp,
        qty,
        adjustReason.trim() || `Manual ${adjustOp} from mobile`
      );
      showToast(res.message || 'Stock updated successfully', 'success');
      setAdjustModalVisible(false);
      fetchProductsAndSummary();
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust stock', 'error');
    } finally {
      setAdjusting(false);
    }
  };

  const handleDelete = (prod: ProductItem) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${prod.name}"? Historical invoices will safely retain their record.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productApi.deleteProduct(prod.id || (prod as any)._id);
              showToast('Product deleted', 'info');
              fetchProductsAndSummary();
            } catch (err: any) {
              showToast(err.message || 'Failed to delete product', 'error');
            }
          },
        },
      ]
    );
  };

  const renderStockBadge = (status: StockStatus, currentStock: number, unit: string) => {
    if (status === 'out_of_stock') {
      return (
        <View style={[styles.stockBadge, styles.outOfStockBadge]}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.stockBadgeText, { color: '#B91C1C' }]}>Out of Stock (0 {unit})</Text>
        </View>
      );
    }
    if (status === 'low_stock') {
      return (
        <View style={[styles.stockBadge, styles.lowStockBadge]}>
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <Text style={[styles.stockBadgeText, { color: '#B45309' }]}>
            Low Stock ({currentStock} {unit})
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.stockBadge, styles.inStockBadge]}>
        <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
        <Text style={[styles.stockBadgeText, { color: '#15803D' }]}>
          In Stock ({currentStock} {unit})
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <AppHeader
        title="Products & Inventory"
        subtitle={`${summary.totalProducts} registered items`}
        onBack={() => router.back()}
        backText="Back"
        rightAction={
          <TouchableOpacity
            style={styles.addHeaderBtn}
            onPress={() => router.push('/products/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.addHeaderBtnText}>+ Add Product</Text>
          </TouchableOpacity>
        }
      />

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TOTAL ITEMS</Text>
          <Text style={styles.metricVal}>{summary.totalProducts}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, { color: '#B45309' }]}>LOW STOCK</Text>
          <Text style={[styles.metricVal, { color: '#B45309' }]}>{summary.lowStockCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, { color: '#B91C1C' }]}>OUT OF STOCK</Text>
          <Text style={[styles.metricVal, { color: '#B91C1C' }]}>{summary.outOfStockCount}</Text>
        </View>
      </View>

      {/* Search Input */}
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
          placeholder="Search product, SKU, or HSN..."
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

      {/* Filter Chips (Stock Status & GST Slabs) */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', 'in_stock', 'low_stock', 'out_of_stock']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedStockStatus === item;
            const label =
              item === 'all'
                ? 'All Status'
                : item === 'in_stock'
                ? 'In Stock'
                : item === 'low_stock'
                ? 'Low Stock'
                : 'Out of Stock';
            return (
              <TouchableOpacity
                onPress={() => setSelectedStockStatus(item as any)}
                style={[styles.filterChip, isSelected ? styles.filterChipActive : null]}
              >
                <Text style={[styles.filterChipText, isSelected ? styles.filterChipTextActive : null]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterChipList}
        />
      </View>

      {/* Products List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0A0A0A" />
          <Text style={styles.loadingText}>Loading products catalog...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id || (item as any)._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0A0A0A" />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'No products match your search query.' : 'Add your first product to start fast billing.'}
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/products/create')}
              >
                <Text style={styles.emptyBtnText}>+ Add New Product</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productMeta}>
                    HSN: {item.hsnCode || '—'} • SKU: {item.sku || '—'} • {item.category || 'General'}
                  </Text>
                </View>
                <View style={styles.gstRatePill}>
                  <Text style={styles.gstRatePillText}>{item.gstRate}% GST</Text>
                </View>
              </View>

              <View style={styles.priceAndStockRow}>
                <View>
                  <Text style={styles.sellingPrice}>₹{Number(item.sellingPrice).toLocaleString('en-IN')}</Text>
                  <Text style={styles.unitText}>per {item.unit || 'piece'}</Text>
                </View>
                {renderStockBadge(item.stockStatus, item.currentStock, item.unit || 'pc')}
              </View>

              {/* Actions Row */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => openAdjustStock(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.adjustBtnText}>⚡ Adjust Stock</Text>
                </TouchableOpacity>

                <View style={styles.rightCardActions}>
                  <TouchableOpacity
                    style={styles.iconActionBtn}
                    onPress={() => router.push(`/products/edit/${item.id || (item as any)._id}` as any)}
                  >
                    <Text style={styles.actionBtnLabel}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconActionBtn, styles.deleteActionBtn]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={[styles.actionBtnLabel, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Adjust Stock Modal */}
      <Modal visible={adjustModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Inventory Stock</Text>
              <TouchableOpacity onPress={() => setAdjustModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {targetProduct && (
              <View style={styles.modalProductInfo}>
                <Text style={styles.modalProdName}>{targetProduct.name}</Text>
                <Text style={styles.modalProdStock}>
                  Current Stock: <Text style={{ fontWeight: '800' }}>{targetProduct.currentStock} {targetProduct.unit}</Text>
                </Text>
              </View>
            )}

            {/* Increase / Decrease Toggle */}
            <View style={styles.adjustToggleRow}>
              <TouchableOpacity
                onPress={() => setAdjustOp('increase')}
                style={[styles.opToggleBtn, adjustOp === 'increase' ? styles.opToggleActiveInc : null]}
              >
                <Text style={[styles.opToggleText, adjustOp === 'increase' ? styles.opToggleTextActive : null]}>
                  + Add Stock (Inflow)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAdjustOp('decrease')}
                style={[styles.opToggleBtn, adjustOp === 'decrease' ? styles.opToggleActiveDec : null]}
              >
                <Text style={[styles.opToggleText, adjustOp === 'decrease' ? styles.opToggleTextActive : null]}>
                  - Reduce Stock (Outflow)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <TextInput
                style={styles.fieldInput}
                keyboardType="numeric"
                value={adjustQty}
                onChangeText={setAdjustQty}
                placeholder="Enter quantity"
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.fieldLabel}>Reason for Adjustment</Text>
              <TextInput
                style={styles.fieldInput}
                value={adjustReason}
                onChangeText={setAdjustReason}
                placeholder="e.g. Purchase order, damaged goods, physical count audit"
              />
            </View>

            <TouchableOpacity
              style={styles.saveAdjustBtn}
              onPress={submitStockAdjustment}
              disabled={adjusting}
              activeOpacity={0.8}
            >
              {adjusting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveAdjustBtnText}>Confirm Stock Adjustment</Text>
              )}
            </TouchableOpacity>
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
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#68728A',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0A0A0A',
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
  filtersWrapper: {
    marginTop: 10,
    marginBottom: 6,
  },
  filterChipList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  filterChipActive: {
    backgroundColor: '#0A0A0A',
    borderColor: '#0A0A0A',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#525866',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  productCard: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0A0A',
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 11,
    color: '#68728A',
  },
  gstRatePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gstRatePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  priceAndStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F3F7',
    marginBottom: 10,
  },
  sellingPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0A0A0A',
  },
  unitText: {
    fontSize: 10.5,
    color: '#68728A',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  lowStockBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustBtn: {
    backgroundColor: '#F8F9FC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adjustBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  rightCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deleteActionBtn: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  actionBtnLabel: {
    fontSize: 12,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  modalClose: {
    fontSize: 18,
    fontWeight: '800',
    color: '#68728A',
  },
  modalProductInfo: {
    backgroundColor: '#F8F9FC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalProdName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  modalProdStock: {
    fontSize: 12,
    color: '#525866',
    marginTop: 2,
  },
  adjustToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  opToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F3F7',
    alignItems: 'center',
  },
  opToggleActiveInc: {
    backgroundColor: '#10B981',
  },
  opToggleActiveDec: {
    backgroundColor: '#EF4444',
  },
  opToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#525866',
  },
  opToggleTextActive: {
    color: '#FFFFFF',
  },
  fieldBox: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0A0A0A',
  },
  saveAdjustBtn: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveAdjustBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
