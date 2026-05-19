import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { recipeController } from '../controllers/RecipeController.js';
import { uploadMiddleware } from '../configs/storage.config.js';

const router = Router();

router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', authMiddleware, uploadMiddleware, recipeController.create);
router.delete('/:id', authMiddleware, recipeController.delete);

export default router;