import type { ISpeciesDTO } from "@project/shared";
import type { ISpecieCreateModel } from "../models/Species.ts";
import { getPublicUrl } from "../configs/storage.config.js";
import { prisma } from "../lib/prisma.js";

export class PlantSpecieRepository {
    async getSpecies() : Promise<ISpeciesDTO[] | null>{
        const result = await prisma.plantSpecies.findMany();

        if (!result) {
            return null;
        }

        const plantSpecies: ISpeciesDTO[] = result.map((item : typeof result[number]) => {
            return {
                id: Number(item?.id),
                name: String(item?.name),
                description: String(item?.description),
                ideal_values: (item?.idealValues as Record<string, any>) ?? {},
                imageUrl: getPublicUrl(String(item?.imagePath))
            };
        });

        return plantSpecies;
    }
    
    async getById(id : number) : Promise<ISpeciesDTO | null> {
        const result = await prisma.plantSpecies.findUnique({
            where: {id: id}
        });

        if (!result) {
            return null;
        }

        const plant_specie: ISpeciesDTO = {
            id: Number(result?.id),
            name: String(result?.name),
            description: String(result?.description),
            ideal_values: (result?.idealValues as Record<string, any>) ?? {},
            imageUrl: getPublicUrl(String(result?.imagePath))
        }
        
        return plant_specie;
    }

    async create(data: ISpecieCreateModel){
        try {
            const newSpecies = await prisma.plantSpecies.create({
                data: {
                    name: data.name,
                    description: data.description,
                    idealValues: data.ideal_values as any,
                    imagePath: data.imageUrl
                }
            });
    
            return !!newSpecies;

        } catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }
}

export const plantSpecieRepository = new PlantSpecieRepository();