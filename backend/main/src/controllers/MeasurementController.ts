import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';

class MeasurementController {
    getMeasurements = async (req: AuthRequest, res: Response) => {
        // TODO
        

    }
}

export const measurementController = new MeasurementController();