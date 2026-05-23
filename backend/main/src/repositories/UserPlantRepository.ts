import { prisma } from "../lib/prisma.js";
import type { IUserPlantDTO } from "@project/shared";
import type { IUserPlantCreateModel, IUserPlantUpdateModel } from "../models/UserPlant.js";

export class UserPlantRepository {
    async getPlants(userId : number) : Promise<IUserPlantDTO[] | null>{

        const result = await prisma.userPlants.findMany({
            where : {
                fkUserId: userId
            }
        });

        if (!result) return null;

        const plants: IUserPlantDTO[] = result.map((result) => {
            return {
                id: result.id,
                plantSpecieId: result.fkPlantSpeciesId,
                name: result.name,
                imageUrl: result.imagePath
            }
        });

        return plants;
    }

    async getById(plantId : number, userId : number) : Promise<IUserPlantDTO | null>{
        const result = await prisma.userPlants.findUnique({
            where: {
                id: plantId,
                fkUserId: userId
            }
        });

        if (!result) return null;

        const userPlant: IUserPlantDTO = {
            id: Number(result.id),
            plantSpecieId: result.fkPlantSpeciesId,
            name: result.name,
            imageUrl: result.imagePath
        }

        return userPlant;
    }

    async create(data : IUserPlantCreateModel) : Promise<boolean> {
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
        } catch (error) {
            console.error("Failed to create user plant:", error);
            return false;
        }
    }

    async delete(plantId : number, userId : number) : Promise<boolean>{
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
            
        } catch (error) {
            console.error("Failed to delete sensor:", error);
            return false;
        }
    }

    async update(data : IUserPlantUpdateModel, userId : number) : Promise<boolean>{
        const updatedUserPlant = await prisma.userPlants.updateMany({
            where: {
                id: data.id,
                fkUserId: userId
            },
            data: {
                name: String(data.name),
                fkPlantSpeciesId: Number(data.plantSpecieId),
            }
        });

        if (updatedUserPlant.count === 0) {
            return false;
        }
        return true;
    }
}

export const userPlantRepository = new UserPlantRepository();