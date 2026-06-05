import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import type { IUserPlantCreateRequestDTO, IUserPlantUpdateRequestDTO } from '@project/shared';
import type { IUserPlantCreateModel, IUserPlantUpdateModel } from '../models/UserPlant.js';
import { userPlantService } from '../services/UserPlantService.js';
import { uploadFile, BUCKETS } from '../configs/storage.config.js';
import nodeCrypto from 'crypto';

class UserPlantController {
    getPlants = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;

            const plants = await userPlantService.getPlants(userId);

            if (!plants) {
                return res.status(400).json({ message: "Error: Plants could not be returned!"});
            }

            return res.status(200).json(plants);
        }
        catch (error){
            console.log(error);
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getById = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user?.id!;
            const requestPlantId = req.params.id;
                        
            if (!requestPlantId){
                return res.status(400).json({ message : "Error: PlantID is empty!"});
            }
    
            const parsedId = parseInt(String(requestPlantId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }

            const userPlant = await userPlantService.getById(parsedId, userId);

            if (!userPlant) {
                return res.status(404).json({ message: "Error: Could not find user plant with that id!"});
            }

            return res.status(200).json(userPlant);
        }
        catch (error){
            console.log("Error in getById:", error);
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user?.id!;

            if (!req.file) {
                return res.status(400).json({ message: "Error: Image file is required!" });
            }

            const plantSpecieId = parseInt(String(req.body.plantSpecieId), 10);
            const name = req.body.name;

            if (isNaN(plantSpecieId)) {
                return res.status(400).json({ message: "Error: plantSpecieId must be a valid number!" });
            }

            if (!plantSpecieId || !name) {
                return res.status(400).json({ message: "Error: Critical fields are empty!" });
            }

            const fileExtension = req.file.originalname.split('.').pop();
            const uniqueFileName = `${nodeCrypto.randomBytes(16).toString('hex')}.${fileExtension}`;

            const imageUrl = await uploadFile(
                BUCKETS.PLANTS,
                uniqueFileName,
                req.file.buffer,
                req.file.mimetype
            );

            const data : IUserPlantCreateModel = {
                plantSpecieId,
                name,
                imagePath : imageUrl,
                userId
            }

            const response = await userPlantService.create(data);

            if (!response){
                return res.status(400).json({ message : "Error: Failed to create new user plant! "});
            }

            return res.status(201).json({ message : "Success: User plant was created! "});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    update = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user?.id!;
            const requestPlantId = req.params.id;
                        
            if (!requestPlantId){
                return res.status(400).json({ message : "Error: PlantID is empty!"});
            }
    
            const parsedId = parseInt(String(requestPlantId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }

            const { name } = req.body as IUserPlantUpdateRequestDTO;
                        
            const updateData: IUserPlantUpdateModel = {
                id : parsedId
            };

            if (!name) {
                return res.status(400).json({ message: "Error: No data provided for update." });
            }

            updateData.name = name;

            const response = await userPlantService.update(updateData, userId)

            if (!response){
                return res.status(403).json({ message: "Error: User plant cannot be updated."});
            }

            return res.status(200).json({ message: "Success: User plant updated!"});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    delete = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user?.id!;
            const requestPlantId = req.params.id;
                        
            if (!requestPlantId){
                return res.status(400).json({ message : "Error: PlantID is empty!"});
            }
    
            const parsedId = parseInt(String(requestPlantId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }

            const response = await userPlantService.delete(parsedId, userId);

            if (!response){
                return res.status(400).json({message : "Error: Could not delete user."});
            }

            return res.status(200).json({ message : "Success: UserPlant deleted!"})

        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const userPlantController = new UserPlantController();