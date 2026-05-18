import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';

class SensorController {
    getSensors = async (req: AuthRequest, res: Response) => {
        // TODO
        

    }

    getSensorById = async (req: AuthRequest, res: Response) => {
        // TODO
        

    }

    create = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }

    delete = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }
}

export const sensorController = new SensorController();