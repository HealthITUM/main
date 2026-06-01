import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { pdetController } from '../controllers/PdetController.js';
import { uploadMiddleware } from '../configs/storage.config.js';

const router = Router();

router.get('/:id', authMiddleware, pdetController.getById);
router.post('/', authMiddleware, uploadMiddleware, pdetController.create);

export default router;