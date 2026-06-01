import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";
export class PlantSpecieService {
    async getSpecies() {
        const species = await plantSpecieRepository.getSpecies();
        return species;
    }
    async getById(id) {
        const specie = await plantSpecieRepository.getById(id);
        return specie;
    }
    async create(data) {
        const response = await plantSpecieRepository.create(data);
        return false;
    }
}
export const plantSpecieService = new PlantSpecieService();
