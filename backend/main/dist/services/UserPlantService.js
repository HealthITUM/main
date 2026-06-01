import { userPlantRepository } from "../repositories/UserPlantRepository.js";
export class UserPlantService {
    async getPlants(userId) {
        const plants = await userPlantRepository.getPlants(userId);
        return plants;
    }
    async getById(plantId, userId) {
        const plant = await userPlantRepository.getById(plantId, userId);
        return plant;
    }
    async create(data) {
        const response = await userPlantRepository.create(data);
        return response;
    }
    async update(data, userId) {
        const response = await userPlantRepository.update(data, userId);
        return response;
    }
    async delete(plantId, userId) {
        const response = await userPlantRepository.delete(plantId, userId);
        return response;
    }
}
export const userPlantService = new UserPlantService();
