import { Router } from 'express';
import { plantSpecieController } from '../controllers/PlantSpecieController.js';

const router = Router();

router.get('/', plantSpecieController.getSpecies);
router.get('/:id', plantSpecieController.getSpecieById);

export default router;