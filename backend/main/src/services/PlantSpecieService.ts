import type { ISpeciesDTO } from "@project/shared";
import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";
import type { ISpecieCreateModel } from "../models/Species.js";

export class PlantSpecieService {
    async getSpecies () : Promise<ISpeciesDTO[] | null> {
        // TODO

        const species = await plantSpecieRepository.getSpecies();

        return species;
    }
    async getById (id : number) : Promise<ISpeciesDTO | null> {
        // TODO

        const specie = await plantSpecieRepository.getById(id);

        return specie;
    }
    async create (data : ISpecieCreateModel) : Promise<boolean> {
        // TODO
        
        const response = await plantSpecieRepository.create(data);

        return false;
    }
}

export const plantSpecieService = new PlantSpecieService();