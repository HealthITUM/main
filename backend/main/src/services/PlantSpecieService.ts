import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";

export class PlantSpecieService {
    async getSpecies () {
        // TODO

        var amount = 10;
        plantSpecieRepository.getSpecies(amount);
    }
    async getSpecieById (id : Number) {
        // TODO

        plantSpecieRepository.getById(id);
    }
}

export const plantSpecieService = new PlantSpecieService();