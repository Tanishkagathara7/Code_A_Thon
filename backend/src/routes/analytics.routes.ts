import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

// GET /api/analytics/overview (JWT Protected)
router.get('/overview', requireAuth, AnalyticsController.getOverview);

export default router;
