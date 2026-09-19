import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', ProductController.getAll);
router.get('/summary', ProductController.getSummary);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);
router.post('/:id/adjust-stock', ProductController.adjustStock);
router.get('/:id/stock-history', ProductController.getStockHistory);

export default router;
