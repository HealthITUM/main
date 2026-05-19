import type { IUserPlantDTO } from "@project/shared";
import type { IUserPlantCreateModel, IUserPlantUpdateModel } from "../models/UserPlant.js";

export class UserPlantRepository {
    async getPlants(userId : number) : Promise<IUserPlantDTO[] | null>{
        // TODO
        return null;
    }

    async getById(plantId : number, userId : number) : Promise<IUserPlantDTO | null>{
        // TODO
        return null;
    }

    async create(data : IUserPlantCreateModel) : Promise<boolean> {
        // TODO
        return false;
    }

    async delete(plantId : number, userId : number) : Promise<boolean>{
        // TODO
        return false;
    }

    async update(data : IUserPlantUpdateModel, userId : number) : Promise<boolean>{
        // TODO
        return false;
    }
}

export const userPlantRepository = new UserPlantRepository();