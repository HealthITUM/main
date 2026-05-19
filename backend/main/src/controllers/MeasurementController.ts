import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';

class MeasurementController {
    getMeasurements = async (baseReq: Request, res: Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const measurementController = new MeasurementController();