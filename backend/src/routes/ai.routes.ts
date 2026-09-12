import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Require JWT authentication for all AI routes
router.use(requireAuth);

// AI Generation endpoint
router.post('/generate', AIController.generate);

export default router;
