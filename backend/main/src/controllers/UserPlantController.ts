import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';

class UserPlantController {
    getPlants = async (req: AuthRequest, res: Response) => {
        // TODO
        

    }

    getPlantById = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }

    create = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }

    update = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }

    delete = async (req : AuthRequest, res : Response) => {
        // TODO

        
    }
}

export const userPlantController = new UserPlantController();