import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth, aiLimiter } from '../middleware/auth';

const router = Router();

// Require JWT authentication for all AI routes
router.use(requireAuth);

// AI Generation endpoint with rate limiting safeguard
router.post('/generate', aiLimiter, AIController.generate);

export default router;
