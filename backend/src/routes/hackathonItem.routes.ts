import { Router } from 'express';
import { HackathonItemController } from '../controllers/hackathonItem.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All domain endpoints are strictly protected with JWT middleware
router.use(requireAuth);

// Item CRUD routes
router.post('/', HackathonItemController.create);
router.get('/', HackathonItemController.getAll);
router.get('/:id', HackathonItemController.getById);
router.put('/:id', HackathonItemController.update);
router.delete('/:id', HackathonItemController.delete);

export default router;
