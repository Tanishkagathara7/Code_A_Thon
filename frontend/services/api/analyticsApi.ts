import { apiClient } from './apiClient';
import { AnalyticsOverviewResponse, AnalyticsOverviewData } from '../../types/analytics';
import { storage } from '../../context/AuthContext';

export const ANALYTICS_CACHE_KEY = 'mindbloom_cached_analytics';

export const analyticsApi = {
  /**
   * Fetch user-isolated analytics overview statistics and cache on success.
   */
  async getOverview(): Promise<AnalyticsOverviewData> {
    const response = await apiClient.get<AnalyticsOverviewResponse>('/analytics/overview');
    if (response.success && response.data) {
      // Asynchronously cache last known successful analytics
      storage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(response.data)).catch(() => {});
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch analytics overview');
  },

  /**
   * Retrieve cached last-known analytics overview data for offline viewing.
   */
  async getCachedOverview(): Promise<AnalyticsOverviewData | null> {
    try {
      const cached = await storage.getItem(ANALYTICS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as AnalyticsOverviewData;
      }
    } catch {}
    return null;
  },
};
