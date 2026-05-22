import type { ISpeciesDTO } from "@project/shared";
import type { ISpecieCreateModel } from "../models/Species.js";

export class PlantSpecieRepository {
    async getSpecies(amount? : number) : Promise<ISpeciesDTO[] | null>{
        // TODO
        return null;
    }
    
    async getById(id : number) : Promise<ISpeciesDTO | null> {
        // TODO
        return null;
    }

    async create(data : ISpecieCreateModel) : Promise<boolean> {
        // TODO
        return false;
    }
}

export const plantSpecieRepository = new PlantSpecieRepository();