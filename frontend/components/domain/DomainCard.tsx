import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { DomainEntity } from '../../types/domain';

interface DomainCardProps {
  item: DomainEntity;
  index?: number;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

const getStatusBadgeStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { bg: '#DCFCE7', text: '#15803D', label: 'Completed' };
    case 'in_progress':
      return { bg: '#E0E7FF', text: '#4338CA', label: 'In Progress' };
    case 'pending':
    default:
      return { bg: '#FEF3C7', text: '#B45309', label: 'Pending' };
  }
};

export const DomainCard: React.FC<DomainCardProps> = ({
  item,
  index = 0,
  onPress,
  onEdit,
  onDelete,
  secondaryAction,
}) => {
  const scale = useSharedValue(1);
  const statusInfo = getStatusBadgeStyle(item.status);
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Limit staggered delay to initial visible subset (max 8 items) to maintain high scroll performance
  const delay = Math.min(index, 6) * 40;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(200)} style={animatedStyle}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={onPress ? 0.88 : 1}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={`Item: ${item.title}, Status: ${statusInfo.label}`}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {item.category ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          {formattedDate ? (
            <Text style={styles.dateText}>{formattedDate}</Text>
          ) : (
            <View />
          )}

          <View style={styles.actionsGroup}>
            {secondaryAction ? (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={secondaryAction.onPress}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={secondaryAction.label}
              >
                <Text style={styles.secondaryBtnText}>{secondaryAction.label}</Text>
              </TouchableOpacity>
            ) : null}

            {onEdit ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onEdit}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${item.title}`}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            ) : null}

            {onDelete ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={onDelete}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.title}`}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    ...Platform.select({
      ios: {
        shadowColor: '#18181B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 3px 6px rgba(24, 24, 27, 0.05))',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  categoryBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525B',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  description: {
    fontSize: 13.5,
    color: '#71717A',
    lineHeight: 19,
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  dateText: {
    fontSize: 12,
    color: '#A1A1AA',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27272A',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
