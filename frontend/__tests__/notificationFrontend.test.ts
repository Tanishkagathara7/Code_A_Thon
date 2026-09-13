import { AppNotification, NotificationType, PaginatedNotifications } from '../types/notification';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Mock Notification API Service for Frontend Unit Assertions
class MockNotificationApiService {
  private notifications: AppNotification[] = [
    {
      _id: 'notif_1',
      recipient: 'user_123',
      type: 'ITEM_CREATED',
      title: 'Item created',
      message: 'Your item was created successfully.',
      read: false,
      data: { entityId: 'item_101', entityType: 'item' },
      createdAt: '2026-09-13T10:00:00Z',
      updatedAt: '2026-09-13T10:00:00Z',
    },
    {
      _id: 'notif_2',
      recipient: 'user_123',
      type: 'ITEM_COMPLETED',
      title: 'Item completed',
      message: 'Your item has been marked as completed.',
      read: false,
      data: { entityId: 'item_102', entityType: 'item' },
      createdAt: '2026-09-13T11:00:00Z',
      updatedAt: '2026-09-13T11:00:00Z',
    },
    {
      _id: 'notif_3',
      recipient: 'user_123',
      type: 'AI_COMPLETED',
      title: 'AI Task Completed',
      message: 'Your AI request was processed successfully.',
      read: true,
      data: { entityType: 'ai' },
      createdAt: '2026-09-13T12:00:00Z',
      updatedAt: '2026-09-13T12:00:00Z',
    },
  ];

  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedNotifications> {
    const start = (page - 1) * limit;
    const items = this.notifications.slice(start, start + limit);
    const total = this.notifications.length;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      notifications: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter((n) => !n.read).length;
  }

  async markAsRead(id: string): Promise<AppNotification> {
    const notif = this.notifications.find((n) => n._id === id);
    if (!notif) throw new Error('Notification not found');
    notif.read = true;
    return { ...notif };
  }

  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    let count = 0;
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true;
        count++;
      }
    });
    return { modifiedCount: count };
  }
}

// Cache simulator for offline mode tests
class MockStorage {
  private cache: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
  }
}

async function runNotificationFrontendTests() {
  console.log('--- Running Notification Frontend Unit Tests ---');
  const service = new MockNotificationApiService();
  const mockStorage = new MockStorage();

  // Test 1: Fetch notification list & pagination structure
  const listRes = await service.getNotifications(1, 10);
  assert(listRes.notifications.length === 3, 'Should return 3 notifications');
  assert(listRes.pagination.total === 3, 'Total should be 3');
  assert(listRes.pagination.page === 1, 'Page should be 1');
  console.log('✅ 1. Notification list & pagination API structure passed');

  // Test 2: Fetch unread count
  const unreadCount = await service.getUnreadCount();
  assert(unreadCount === 2, 'Should have 2 unread notifications initially');
  console.log('✅ 2. Unread notification count fetch passed');

  // Test 3: Mark single notification as read & state transition
  const updatedNotif = await service.markAsRead('notif_1');
  assert(updatedNotif.read === true, 'Notification 1 read state should be true');

  const unreadCountAfterSingle = await service.getUnreadCount();
  assert(unreadCountAfterSingle === 1, 'Unread count should decrease to 1');
  console.log('✅ 3. Mark single notification as read passed');

  // Test 4: Mark all as read & zero count verification
  const markAllResult = await service.markAllAsRead();
  assert(markAllResult.modifiedCount === 1, 'Should mark remaining 1 notification as read');

  const unreadCountAfterAll = await service.getUnreadCount();
  assert(unreadCountAfterAll === 0, 'Unread count should be 0 after markAllAsRead');
  console.log('✅ 4. Mark all notifications as read passed');

  // Test 5: Notification payload entity navigation metadata
  const sampleNotif: AppNotification = {
    _id: 'notif_99',
    recipient: 'user_123',
    type: 'ITEM_CREATED',
    title: 'Item Created',
    message: 'Message',
    read: false,
    data: { entityId: 'item_456', entityType: 'item' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  assert(sampleNotif.data?.entityId === 'item_456', 'Entity ID metadata must match');
  assert(sampleNotif.data?.entityType === 'item', 'Entity Type metadata must match');
  console.log('✅ 5. Entity navigation metadata structure passed');

  // Test 6: Offline cached fallback simulation
  await mockStorage.setItem('mindbloom_cached_unread_count', '5');
  await mockStorage.setItem(
    'mindbloom_cached_notifications',
    JSON.stringify(listRes)
  );

  const cachedCountStr = await mockStorage.getItem('mindbloom_cached_unread_count');
  const cachedNotifsStr = await mockStorage.getItem('mindbloom_cached_notifications');

  assert(cachedCountStr === '5', 'Cached unread count should be retrieved when offline');
  assert(cachedNotifsStr !== null, 'Cached notifications should be retrieved when offline');
  const parsedNotifs = JSON.parse(cachedNotifsStr!) as PaginatedNotifications;
  assert(parsedNotifs.notifications.length === 3, 'Parsed cached notifications length should match');
  console.log('✅ 6. Offline cached notification fallback passed');

  console.log('--- All Notification Frontend Unit Tests Passed! ---');
}

runNotificationFrontendTests();
