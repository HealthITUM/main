import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { userPlantController } from '../controllers/UserPlantController.js';
import { sensorController } from '../controllers/SensorController.js';
import { measurementController } from '../controllers/MeasurementController.js';

const router = Router();

router.get('/',         authMiddleware, userPlantController.getPlants);
router.get('/:id',      authMiddleware, userPlantController.getPlantById);
router.post('/',        authMiddleware, userPlantController.create);
router.patch('/:id',    authMiddleware, userPlantController.update);
router.delete('/:id',   authMiddleware, userPlantController.delete);

router.get('/:id/sensors',          authMiddleware, sensorController.getSensors);
router.get('/:id/sensors/:id',      authMiddleware, sensorController.getSensorById);
router.post('/:id/sensors',         authMiddleware, sensorController.create);
router.delete('/:id/sensors/:id',   authMiddleware, sensorController.delete);

router.get('/:id/measurements', authMiddleware, measurementController.getMeasurements);

export default router;