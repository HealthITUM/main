import type { IPlantDetectionsDTO } from "@project/shared";
import { pdetRepository } from "../repositories/PdetRequestRepository.js";
import type { IPlantDetectionCreateModel, IPlantDetectionUpdateModel } from "../models/PdetRequests.js";
import { queueSenders } from "../rabbitmq/QueueSender.js";
import type { IPlantDetectionTaskModel } from "../models/RabbitMqModels.js";
import { getInternalUrl } from "../configs/storage.config.js";

export class PdetService {
    async getById (id : number) : Promise<IPlantDetectionsDTO | null> {        
        const recipe = await pdetRepository.getById(id);

        return recipe;
    }

    async create (data : IPlantDetectionCreateModel) : Promise<number> {        
        const response = await pdetRepository.create(data);

        if (response === false) {
            console.log("[PdetService] Failed to create request.")
            return -1;
        }

        const pdetTaskData : IPlantDetectionTaskModel = {
            requestId : response,
            imageUrl : getInternalUrl(data.imageUrl)
        }

        const responseQueue = await queueSenders.sendPlantDetectionTask(pdetTaskData);

        if (responseQueue) {
            return response;
        } else {
            await pdetRepository.delete(response);
            return -1;
        }
    }

    async update (data : IPlantDetectionUpdateModel) : Promise<boolean> {        
        const response = await pdetRepository.update(data);

        return response;
    }
}

export const pdetService = new PdetService();