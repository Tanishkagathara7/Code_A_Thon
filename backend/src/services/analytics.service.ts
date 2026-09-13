import mongoose from 'mongoose';
import { HackathonItem } from '../models/HackathonItem';

export interface OverviewMetrics {
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
  status: string;
  category: string;
  createdAt: Date;
}

export interface AnalyticsOverviewData {
  overview: OverviewMetrics;
  categories: CategoryMetric[];
  activity: ActivityMetric[];
  recentActivity: RecentActivityItem[];
}

export class AnalyticsService {
  /**
   * Calculates comprehensive user-isolated analytics using server-side MongoDB aggregation.
   * @param userId The authenticated user ID
   */
  static async getOverview(userId: string): Promise<AnalyticsOverviewData> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Status overview & total counts aggregation
    const statusAgg = await HackathonItem.aggregate([
      { $match: { owner: userObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    statusAgg.forEach((item) => {
      total += item.count;
      if (item._id === 'completed') {
        completed = item.count;
      } else if (item._id === 'in_progress') {
        inProgress = item.count;
      } else if (item._id === 'pending') {
        pending = item.count;
      }
    });

    const completionRate = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;

    // 2. Category distribution aggregation
    const categoryAgg = await HackathonItem.aggregate([
      { $match: { owner: userObjectId } },
      {
        $group: {
          _id: { $ifNull: ['$category', 'Uncategorized'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]);

    const categories: CategoryMetric[] = categoryAgg.map((c) => ({
      category: c._id || 'Uncategorized',
      count: c.count,
    }));

    // 3. Activity over time (daily activity for last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const activityAgg = await HackathonItem.aggregate([
      {
        $match: {
          owner: userObjectId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const activity: ActivityMetric[] = activityAgg.map((a) => ({
      date: a._id,
      count: a.count,
    }));

    // 4. Recent activity (top 5 recent items)
    const recentItems = await HackathonItem.find({ owner: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status category createdAt')
      .lean();

    const recentActivity: RecentActivityItem[] = recentItems.map((item: any) => ({
      id: item._id.toString(),
      title: item.title,
      status: item.status,
      category: item.category || 'Uncategorized',
      createdAt: item.createdAt,
    }));

    return {
      overview: {
        total,
        completed,
        inProgress,
        pending,
        completionRate,
      },
      categories,
      activity,
      recentActivity,
    };
  }
}
