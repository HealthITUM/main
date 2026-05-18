import type { IUserPlantCreateRequestDTO, IUserPlantUpdateRequestDTO } from "@project/shared";

export class UserPlantRepository {
    async getPlants(amount? : Number){
        // TODO
        
    }

    async getById(id : Number){
        // TODO

    }

    async create(data : IUserPlantCreateRequestDTO) {
        // TODO

    }

    async update(data : IUserPlantUpdateRequestDTO){
        // TODO

    }

    async delete(id : Number){
        // TODO
        
    }
}

export const userPlantRepository = new UserPlantRepository();