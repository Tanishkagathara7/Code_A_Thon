import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SortOption } from '../../types/domain';
import { appConfig } from '../../config/appConfig';

export interface FilterBarProps {
  selectedStatus?: string;
  onStatusChange: (status: string | undefined) => void;
  selectedCategory?: string;
  categories?: string[];
  onCategoryChange: (category: string | undefined) => void;
  selectedSort?: SortOption;
  onSortChange: (sort: SortOption | undefined) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: undefined },
  ...appConfig.statuses.map((s) => ({ label: s.label, value: s.key })),
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest First', value: 'createdAt_desc' },
  { label: 'Oldest First', value: 'createdAt_asc' },
  { label: 'Title A–Z', value: 'title_asc' },
  { label: 'Title Z–A', value: 'title_desc' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  categories = [],
  onCategoryChange,
  selectedSort = 'createdAt_desc',
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === selectedSort)?.label || 'Sort';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort Selector Trigger */}
        <TouchableOpacity
          style={[
            styles.chip,
            selectedSort !== 'createdAt_desc' && styles.activeChip,
          ]}
          onPress={() => setIsSortModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              selectedSort !== 'createdAt_desc' && styles.activeChipText,
            ]}
          >
            Sort: {currentSortLabel} ▾
          </Text>
        </TouchableOpacity>

        {/* Status Filters */}
        {STATUS_OPTIONS.map((opt) => {
          const isActive = selectedStatus === opt.value;
          return (
            <TouchableOpacity
              key={opt.label}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => onStatusChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Category Filter Trigger */}
        {(categories.length > 0 || selectedCategory) && (
          <TouchableOpacity
            style={[styles.chip, selectedCategory ? styles.activeChip : null]}
            onPress={() => setIsCategoryModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedCategory ? styles.activeChipText : null]}>
              {selectedCategory ? `Cat: ${selectedCategory}` : 'Category ▾'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClearFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.clearBtnText}>Clear ✕</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sort Selection Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Items</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.modalOption,
                  selectedSort === opt.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  onSortChange(opt.value);
                  setIsSortModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedSort === opt.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsCategoryModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity
              style={[
                styles.modalOption,
                !selectedCategory && styles.modalOptionSelected,
              ]}
              onPress={() => {
                onCategoryChange(undefined);
                setIsCategoryModalVisible(false);
              }}
            >
              <Text style={[styles.modalOptionText, !selectedCategory && styles.modalOptionTextSelected]}>
                All Categories
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.modalOption,
                  selectedCategory === cat && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  onCategoryChange(cat);
                  setIsCategoryModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedCategory === cat && styles.modalOptionTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  activeChip: {
    backgroundColor: '#EDE9FE',
    borderColor: '#5B45F5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#68728A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  activeChipText: {
    color: '#5B45F5',
    fontWeight: '700',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 18, 38, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101226',
    marginBottom: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  modalOptionSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#5B45F5',
  },
  modalOptionText: {
    fontSize: 13.5,
    color: '#101226',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: '#5B45F5',
    fontWeight: '800',
  },
});
