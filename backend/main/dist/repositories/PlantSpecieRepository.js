import { getPublicUrl } from "../configs/storage.config.js";
import { prisma } from "../lib/prisma.js";
export class PlantSpecieRepository {
    async getSpecies() {
        const result = await prisma.plantSpecies.findMany();
        if (!result) {
            return null;
        }
        const plantSpecies = result.map((item) => {
            return {
                id: Number(item?.id),
                name: String(item?.name),
                description: String(item?.description),
                ideal_values: item?.idealValues ?? {},
                imageUrl: getPublicUrl(String(item?.imagePath))
            };
        });
        return plantSpecies;
    }
    async getById(id) {
        const result = await prisma.plantSpecies.findUnique({
            where: { id: id }
        });
        if (!result) {
            return null;
        }
        const plant_specie = {
            id: Number(result?.id),
            name: String(result?.name),
            description: String(result?.description),
            ideal_values: result?.idealValues ?? {},
            imageUrl: getPublicUrl(String(result?.imagePath))
        };
        return plant_specie;
    }
    async create(data) {
        try {
            const newSpecies = await prisma.plantSpecies.create({
                data: {
                    name: data.name,
                    description: data.description,
                    idealValues: data.ideal_values,
                    imagePath: data.imageUrl
                }
            });
            return !!newSpecies;
        }
        catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }
}
export const plantSpecieRepository = new PlantSpecieRepository();
