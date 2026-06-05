import { prisma } from "../lib/prisma.js";
import type { IPlantDetectionCreateModel, IPlantDetectionUpdateModel } from "../models/PdetRequests.js"
import type { IPlantDetectionsDTO  } from "@project/shared";
import type { RequestStatus } from "@project/shared"

export class PdetRepository {
    async getById(id : number) : Promise<IPlantDetectionsDTO | null>{
        try {
            const result = await prisma.userPdetRequests.findUnique({
                where: {id: id}
            });

            if (!result) return null;

            const request: IPlantDetectionsDTO = {
                id: result.id,
                type : result.status as unknown as RequestStatus,
                imageUrl : result.imageUrl,
                plantSpeciesId : result.fkPlantSpeciesId
            }

            return request;
        }
        catch (error) {
            console.error("Failed to update request:", error);
            return null;
        }
    }

    async create(data : IPlantDetectionCreateModel) : Promise<number | false> {
        try {
            const newRequest = await prisma.userPdetRequests.create({
                data: {
                    fkUserId : data.userId,
                    imageUrl : data.imageUrl
                }
            });

            return newRequest.id;
        } catch (error) {
            console.error("Failed to create pdet request:", error);
            return false;
        }
    }

    async update(data: IPlantDetectionUpdateModel): Promise<boolean> {
        try {
            const updatePayload: any = {
                status: data.status
            };

            if (data.plantSpeciesId !== undefined) {
                updatePayload.fkPlantSpeciesId = data.plantSpeciesId;
            }

            const newRequest = await prisma.userPdetRequests.update({
                where: { id: data.id },
                data: updatePayload
            });
            return !!newRequest;
        } catch (error) {
            console.error("Failed to update request:", error);
            return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.userPdetRequests.delete({
                where: { 
                    id
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to delete pdet request:", error);
            return false;
        }
    }
}

export const pdetRepository = new PdetRepository();