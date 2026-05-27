import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { userController } from '../controllers/UserController.js';

const router = Router();

router.get('/me', authMiddleware, userController.getProfile);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.patch('/me', authMiddleware, userController.update);

export default router;