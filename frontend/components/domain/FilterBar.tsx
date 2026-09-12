import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SortOption } from '../../types/domain';

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
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
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

        {/* Category Filter Trigger (if categories available or selected) */}
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeChip: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F87171',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1E274A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalOptionSelected: {
    backgroundColor: '#6366F1',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: '#FFFFFF',
  },
});
