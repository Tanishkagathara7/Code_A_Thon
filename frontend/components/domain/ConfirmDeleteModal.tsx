import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

interface ConfirmDeleteModalProps {
  visible: boolean;
  title?: string;
  itemTitle?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  title = 'Delete Item',
  itemTitle,
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(200)} style={styles.dialog}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🗑️</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            Are you sure you want to delete{' '}
            {itemTitle ? <Text style={styles.itemBold}>"{itemTitle}"</Text> : 'this item'}?
            This action is permanent and cannot be undone.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isDeleting}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Cancel delete"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onConfirm}
              disabled={isDeleting}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteText}>Confirm Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {
        filter: 'drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.15))',
      },
    }),
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  message: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  itemBold: {
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27272A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
