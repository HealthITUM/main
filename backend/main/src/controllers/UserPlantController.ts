import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';

class UserPlantController {
    getPlants = async (req: AuthRequest, res: Response) => {
        try {
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getPlantById = async (req : AuthRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    update = async (req : AuthRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    delete = async (req : AuthRequest, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const userPlantController = new UserPlantController();