import type { ISpecieDTO } from "@project/shared";
import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";

export class PlantSpecieService {
    async getSpecies () : Promise<ISpecieDTO[] | null> {
        // TODO

        const species = await plantSpecieRepository.getSpecies();

        return species;
    }
    async getById (id : number) : Promise<ISpecieDTO | null> {
        // TODO

        const specie = await plantSpecieRepository.getById(id);

        return specie;
    }
}

export const plantSpecieService = new PlantSpecieService();