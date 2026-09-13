export interface AnalyticsOverviewMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
}

export interface ActivityMetric {
  date: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | string;
  category: string;
  createdAt: string;
}

export interface AnalyticsOverviewData {
  overview: AnalyticsOverviewMetrics;
  categories: CategoryMetric[];
  activity: ActivityMetric[];
  recentActivity: RecentActivityItem[];
}

export interface AnalyticsOverviewResponse {
  success: boolean;
  data: AnalyticsOverviewData;
  error?: string;
}
