import { userPlantRepository } from "../repositories/UserPlantRepository.js";
import type { IUserPlantCreateRequestDTO, IUserPlantUpdateRequestDTO } from "@project/shared";

export class UserPlantService {
    async getPlants(){
        // TODO

        var amount = 10;
        userPlantRepository.getPlants(amount);
    }

    async getById(id : number){
        // TODO

        userPlantRepository.getById(id);
    }

    async create(data : IUserPlantCreateRequestDTO) {
        // TODO

        userPlantRepository.create(data);
    }

    async update(data : IUserPlantUpdateRequestDTO){
        // TODO

        userPlantRepository.update(data);
    }

    async delete(id : number){
        // TODO
    
        userPlantRepository.delete(id);
    }
}

export const userPlantService = new UserPlantService();