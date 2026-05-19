import type { IUserPlantCreateModel, IUserPlantUpdateModel } from "../models/UserPlant.js";
import type { IUserPlantDTO } from "@project/shared";
import { userPlantRepository } from "../repositories/UserPlantRepository.js";

export class UserPlantService {
    async getPlants(userId : number) : Promise<IUserPlantDTO[] | null> {
        // TODO

        const plants = await userPlantRepository.getPlants(userId);

        return plants;
    }

    async getById(plantId : number, userId : number) : Promise<IUserPlantDTO | null> {
        // TODO

        const plant = await userPlantRepository.getById(plantId, userId);

        return plant;
    }

    async create(data : IUserPlantCreateModel) : Promise<boolean> {
        // TODO

        const response = await userPlantRepository.create(data);
        
        return response;
    }

    async update(data : IUserPlantUpdateModel, userId : number) : Promise<boolean> {
        // TODO

        const response = await userPlantRepository.update(data, userId);

        return response;
    }

    async delete(plantId : number, userId : number) : Promise<boolean> {
        // TODO
    
        const response = await userPlantRepository.delete(plantId, userId);

        return response;
    }
}

export const userPlantService = new UserPlantService();