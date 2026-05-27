import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { recipeController } from '../controllers/RecipeController.js';
import { uploadMiddleware, parseJsonField } from '../configs/storage.config.js';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getById);
router.post('/', authMiddleware, uploadMiddleware, parseJsonField('ingredients'), recipeController.create);
router.delete('/:id', authMiddleware, recipeController.delete);

export default router;