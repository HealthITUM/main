import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { measurementService } from '../services/MeasurementService.js';

class MeasurementController {
    getMeasurements = async (req: AuthRequest, res: Response) => {
        const requestPlantId = req.params.plantId;

        if (!requestPlantId){
            return res.status(400).json({ message : "Error: PlantID is empty!"});
        }

        const parsedId = parseInt(String(requestPlantId), 10);

        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
        }

        const measurements = await measurementService.getMeasurements(parsedId);

        if (!measurements){
            return res.status(400).json({ message: "Error: Measurements could not be returned!"});
        }

        return res.status(200).json(measurements);
    }
}

export const measurementController = new MeasurementController();