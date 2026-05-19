import type { Request, Response } from 'express';

class PlantSpecieController {
    getSpecies = async (req: Request, res: Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getSpecieById = async (req : Request, res : Response) => {
        try {

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const plantSpecieController = new PlantSpecieController();