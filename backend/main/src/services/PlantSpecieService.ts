import type { ISpecieDTO } from "@project/shared";
import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";

export class PlantSpecieService {
    async getSpecies () : Promise<Array<ISpecieDTO>> {
        // TODO

        var amount = 10;
        const species = await plantSpecieRepository.getSpecies(amount);

        return species;
    }
    async getSpecieById (id : number) : Promise<ISpecieDTO> {
        // TODO

        const specie = await plantSpecieRepository.getById(id);
        return specie;
    }
}

export const plantSpecieService = new PlantSpecieService();