import type { ISpecieDTO } from "@project/shared";

export class PlantSpecieRepository {
    async getSpecies(amount? : number) : Promise<ISpecieDTO[] | null>{
        // TODO
        return null;
    }
    
    async getById(id : number) : Promise<ISpecieDTO | null> {
        // TODO
        return null;
    }
}

export const plantSpecieRepository = new PlantSpecieRepository();