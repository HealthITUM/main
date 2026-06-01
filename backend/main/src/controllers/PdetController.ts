import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import type { IPlantDetectionCreateModel } from '../models/PdetRequests.js';
import type { IPlantDetectionCreateResponseDTO } from '@project/shared'
import { pdetService } from '../services/PdetService.js';
import { uploadFile, BUCKETS } from '../configs/storage.config.js';
import nodeCrypto from 'crypto';

class PdetController {
    getById = async (req : AuthRequest, res : Response) => {
        try {
            const requestPderId = req.params.id;

            if (!requestPderId){
                return res.status(404).json({ message : "Error: Plant detection request ID is empty!"})
            }

            const parsedId = parseInt(String(requestPderId), 10);

            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: Plant detection request ID must be a valid number!" });
            }

            const request = await pdetService.getById(parsedId);

            if (!request){
                return res.status(404).json({ message: "Error: Plant detection request with that id does not exist!" });
            }

            return res.status(200).json(request);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user!.id;

            if (!req.file) {
                return res.status(400).json({ message: "Error: Image file is required!" });
            } 

            const fileExtension = req.file.originalname.split('.').pop();
            const uniqueFileName = `${nodeCrypto.randomBytes(16).toString('hex')}.${fileExtension}`;

            const imageUrl = await uploadFile(
                BUCKETS.PDET_REQUESTS,
                uniqueFileName,
                req.file.buffer,
                req.file.mimetype
            );

            const data : IPlantDetectionCreateModel = {
                userId,
                imageUrl
            }

            const requestId = await pdetService.create(data);

            if (requestId === -1) {
                return res.status(400).json({ message : "Error: Failed to create request!"});
            }

            const response : IPlantDetectionCreateResponseDTO = {
                requestId
            }

            return res.status(202).json(response);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }   
    }
}

export const pdetController = new PdetController();