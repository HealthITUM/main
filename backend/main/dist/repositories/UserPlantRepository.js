import { getPublicUrl } from "../configs/storage.config.js";
import { prisma } from "../lib/prisma.js";
export class UserPlantRepository {
    async getPlants(userId) {
        const result = await prisma.userPlants.findMany({
            where: {
                fkUserId: userId
            }
        });
        if (!result)
            return null;
        const plants = result.map((item) => {
            return {
                id: item.id,
                plantSpecieId: item.fkPlantSpeciesId,
                name: item.name,
                imageUrl: getPublicUrl(String(item.imagePath))
            };
        });
        return plants;
    }
    async getById(plantId, userId) {
        const result = await prisma.userPlants.findUnique({
            where: {
                id: plantId,
                fkUserId: userId
            }
        });
        if (!result)
            return null;
        const userPlant = {
            id: Number(result.id),
            plantSpecieId: result.fkPlantSpeciesId,
            name: result.name,
            imageUrl: getPublicUrl(String(result?.imagePath))
        };
        return userPlant;
    }
    async create(data) {
        try {
            const newUserPlant = await prisma.userPlants.create({
                data: {
                    name: data.name,
                    fkPlantSpeciesId: data.plantSpecieId,
                    imagePath: data.imagePath,
                    fkUserId: data.userId
                }
            });
            return !!newUserPlant;
        }
        catch (error) {
            console.error("Failed to create user plant:", error);
            return false;
        }
    }
    async delete(plantId, userId) {
        try {
            const deleteResult = await prisma.userPlants.deleteMany({
                where: {
                    id: plantId,
                    fkUserId: userId
                }
            });
            if (deleteResult.count === 0) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Failed to delete sensor:", error);
            return false;
        }
    }
    async update(data, userId) {
        const updatedUserPlant = await prisma.userPlants.updateMany({
            where: {
                id: data.id,
                fkUserId: userId
            },
            data: {
                name: String(data.name)
            }
        });
        if (updatedUserPlant.count === 0) {
            return false;
        }
        return true;
    }
}
export const userPlantRepository = new UserPlantRepository();
