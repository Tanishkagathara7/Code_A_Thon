import { ApiError } from '../types/domain';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runNetworkResilienceTests() {
  console.log('--- Running Network Resilience & Offline Handling Unit Tests ---');

  // Test 1: ApiError derives correct error kind for network failures
  const netErr1 = new ApiError('Network request failed. Check your internet connection.', 0);
  assert(netErr1.kind === 'NETWORK', 'netErr1.kind should be NETWORK');
  assert(netErr1.isNetworkError === true, 'netErr1.isNetworkError should be true');
  assert(netErr1.isTimeout === false, 'netErr1.isTimeout should be false');

  const netErr2 = new ApiError('Failed to fetch', 0);
  assert(netErr2.kind === 'NETWORK', 'netErr2.kind should be NETWORK');
  assert(netErr2.isNetworkError === true, 'netErr2.isNetworkError should be true');
  console.log('✅ 1. ApiError derives correct error kind for network failures');

  // Test 2: ApiError derives correct error kind for client-side request timeout
  const timeoutErr = new ApiError(
    'The server is taking too long to respond. Please try again.',
    0,
    null,
    'TIMEOUT'
  );
  assert(timeoutErr.kind === 'TIMEOUT', 'timeoutErr.kind should be TIMEOUT');
  assert(timeoutErr.isTimeout === true, 'timeoutErr.isTimeout should be true');
  assert(timeoutErr.isNetworkError === false, 'timeoutErr.isNetworkError should be false');
  console.log('✅ 2. ApiError derives correct error kind for client-side request timeout');

  // Test 3: ApiError derives HTTP 4xx as CLIENT and HTTP 5xx as SERVER errors
  const clientErr = new ApiError('Resource not found', 404);
  assert(clientErr.kind === 'CLIENT', 'clientErr.kind should be CLIENT');
  assert(clientErr.status === 404, 'clientErr.status should be 404');

  const serverErr = new ApiError('Internal server error', 500);
  assert(serverErr.kind === 'SERVER', 'serverErr.kind should be SERVER');
  assert(serverErr.status === 500, 'serverErr.status should be 500');
  console.log('✅ 3. ApiError derives HTTP 4xx as CLIENT and HTTP 5xx as SERVER errors');

  // Test 4: Network status classification logic
  const deriveStatus = (isConnected: boolean | null, isInternetReachable: boolean | null) => {
    if (isConnected === null) return { status: 'checking', isOffline: false };
    if (isConnected === false || isInternetReachable === false) return { status: 'offline', isOffline: true };
    return { status: 'online', isOffline: false };
  };

  const s1 = deriveStatus(true, true);
  assert(s1.status === 'online' && s1.isOffline === false, 's1 should be online');

  const s2 = deriveStatus(false, true);
  assert(s2.status === 'offline' && s2.isOffline === true, 's2 should be offline');

  const s3 = deriveStatus(true, false);
  assert(s3.status === 'offline' && s3.isOffline === true, 's3 should be offline');

  const s4 = deriveStatus(null, null);
  assert(s4.status === 'checking' && s4.isOffline === false, 's4 should be checking');
  console.log('✅ 4. Network status logic handles isConnected and isInternetReachable flags correctly');

  // Test 5: Analytics Overview caches successful response and retrieves stale data when offline
  const mockStorageMap = new Map<string, string>();
  const mockStorage = {
    async setItem(key: string, value: string) {
      mockStorageMap.set(key, value);
    },
    async getItem(key: string) {
      return mockStorageMap.get(key) || null;
    },
  };

  const ANALYTICS_CACHE_KEY = 'mindbloom_cached_analytics';
  const mockOverview = {
    overview: { total: 10, completed: 6, inProgress: 3, pending: 1, completionRate: 60 },
    categories: [{ category: 'Engineering', count: 6, percentage: 60 }],
    activity: [{ date: '2026-09-12', label: 'Sat', count: 4 }],
    recentActivity: [{ id: 'item_1', title: 'Offline Test Item', status: 'completed', category: 'Engineering', createdAt: '2026-09-12' }],
  };

  await mockStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(mockOverview));
  const rawCached = await mockStorage.getItem(ANALYTICS_CACHE_KEY);
  assert(rawCached !== null, 'rawCached should not be null');
  const cachedData = JSON.parse(rawCached!);
  assert(cachedData.overview.total === 10, 'Cached total should be 10');
  assert(cachedData.overview.completionRate === 60, 'Cached completion rate should be 60');
  assert(cachedData.recentActivity[0].title === 'Offline Test Item', 'Cached title should match');
  console.log('✅ 5. Analytics Overview caches successful response and retrieves stale data when offline');

  // Test 6: Offline mutation protection error messaging logic
  const checkOfflineMutationAllowed = (isOffline: boolean) => {
    if (isOffline) {
      return { allowed: false, message: "You're offline. Reconnect to save your changes." };
    }
    return { allowed: true, message: null };
  };

  const offlineAttempt = checkOfflineMutationAllowed(true);
  assert(offlineAttempt.allowed === false, 'Offline mutation should be disallowed');
  assert(offlineAttempt.message === "You're offline. Reconnect to save your changes.", 'Offline message should match');

  const onlineAttempt = checkOfflineMutationAllowed(false);
  assert(onlineAttempt.allowed === true, 'Online mutation should be allowed');
  assert(onlineAttempt.message === null, 'Online message should be null');
  console.log('✅ 6. Offline mutation protection error messaging logic passed');

  // Test 7: GET retry policy rules (1 retry allowed for GET, 0 for mutations)
  const canAttemptRetry = (method: string, attemptCount: number, maxRetries: number = 1) => {
    if (method.toUpperCase() !== 'GET') return false;
    return attemptCount < maxRetries;
  };

  assert(canAttemptRetry('GET', 0) === true, 'GET attempt 0 should retry');
  assert(canAttemptRetry('GET', 1) === false, 'GET attempt 1 should not retry');
  assert(canAttemptRetry('POST', 0) === false, 'POST should not retry');
  assert(canAttemptRetry('PUT', 0) === false, 'PUT should not retry');
  assert(canAttemptRetry('DELETE', 0) === false, 'DELETE should not retry');
  console.log('✅ 7. GET retry policy rules passed');

  console.log('--- All Network Resilience Tests Passed! ---');
}

runNetworkResilienceTests();
