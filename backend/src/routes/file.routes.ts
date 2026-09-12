import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { uploadFile, getFile, downloadFile, deleteFile } from '../controllers/file.controller';

const router = Router();

// Multer memory storage configuration for file inspection & validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit at multer stream layer
  },
});

router.post('/', requireAuth, upload.single('file'), uploadFile);
router.get('/download/*', requireAuth, downloadFile);
router.get('/:id', requireAuth, getFile);
router.delete('/:id', requireAuth, deleteFile);

export default router;
