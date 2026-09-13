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
import { AppNotification, NotificationType } from '../../types/notification';

interface NotificationCardProps {
  notification: AppNotification;
  index?: number;
  onPress?: (notification: AppNotification) => void;
}

const TYPE_CONFIG: Record<NotificationType, { label: string; badgeBg: string; textColor: string }> = {
  ITEM_CREATED: { label: 'ITEM CREATED', badgeBg: '#EEF2FF', textColor: '#4F46E5' },
  ITEM_UPDATED: { label: 'ITEM UPDATED', badgeBg: '#F0FDF4', textColor: '#16A34A' },
  ITEM_COMPLETED: { label: 'COMPLETED', badgeBg: '#ECFDF5', textColor: '#059669' },
  AI_COMPLETED: { label: 'AI TASK', badgeBg: '#F5F3FF', textColor: '#7C3AED' },
  SYSTEM: { label: 'SYSTEM', badgeBg: '#F3F4F6', textColor: '#4B5563' },
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  index = 0,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const isUnread = !notification.read;
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.SYSTEM;
  const delay = Math.min(index, 6) * 40;

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(200)} style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          isUnread ? styles.unreadCard : styles.readCard,
        ]}
        onPress={() => onPress && onPress(notification)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`${notification.title}, ${isUnread ? 'Unread' : 'Read'}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.typeBadgeWrapper}>
            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
              <Text style={[styles.badgeText, { color: config.textColor }]}>
                {config.label}
              </Text>
            </View>
            {isUnread && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.timestamp}>
            {formatRelativeTime(notification.createdAt)}
          </Text>
        </View>

        <Text style={[styles.title, isUnread ? styles.unreadTitle : styles.readTitle]}>
          {notification.title}
        </Text>

        <Text style={styles.message} numberOfLines={3}>
          {notification.message}
        </Text>

        {notification.data?.entityType && (
          <View style={styles.footerRow}>
            <Text style={styles.actionLink}>
              View {notification.data.entityType} ›
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#1E274A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        filter: 'drop-shadow(0px 3px 8px rgba(30, 39, 74, 0.04))',
      },
    }),
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C7D2FE',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  readCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4F46E5',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  title: {
    fontSize: 15,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  readTitle: {
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  message: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  footerRow: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
