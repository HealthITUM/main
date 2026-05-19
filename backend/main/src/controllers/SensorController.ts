import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';

class SensorController {
    getSensors = async (req: AuthenticatedRequest, res: Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getSensorById = async (req: AuthenticatedRequest, res: Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthenticatedRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }   
    }

    delete = async (req : AuthenticatedRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const sensorController = new SensorController();