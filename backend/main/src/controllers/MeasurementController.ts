import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { measurementService } from '../services/MeasurementService.js';

class MeasurementController {
    getMeasurements = async (req: AuthRequest, res: Response) => {
        const requestPlantId = req.params.id;

        if (!requestPlantId){
            return res.status(400).json({ message : "Error: SpecieID is empty!"});
        }

        const parsedId = parseInt(String(requestPlantId), 10);

        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Error: SpecieID must be a valid number!" });
        }

        const measurements = await measurementService.getMeasurements(parsedId);

        return res.status(200).json(measurements);
    }
}

export const measurementController = new MeasurementController();