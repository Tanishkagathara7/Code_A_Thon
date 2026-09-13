import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  /**
   * GET /api/analytics/overview
   * Retrieve user-isolated analytics overview for the authenticated user.
   */
  static async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized. User session missing.',
        });
      }

      const analyticsData = await AnalyticsService.getOverview(userId);

      return res.status(200).json({
        success: true,
        data: analyticsData,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to calculate analytics overview',
      });
    }
  }
}
