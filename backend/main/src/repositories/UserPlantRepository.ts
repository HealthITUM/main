import type { IUserPlantCreateRequestDTO, IUserPlantUpdateRequestDTO } from "@project/shared";

export class UserPlantRepository {
    async getPlants(amount? : number){
        // TODO
        
    }

    async getById(id : number){
        // TODO

    }

    async create(data : IUserPlantCreateRequestDTO) {
        // TODO

    }

    async update(data : IUserPlantUpdateRequestDTO){
        // TODO

    }

    async delete(id : number){
        // TODO
        
    }
}

export const userPlantRepository = new UserPlantRepository();