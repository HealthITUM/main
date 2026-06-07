import type { IMeasurementDTO } from "@project/shared";
import { prisma } from "../lib/prisma.js";
import type { IMeasurementCreateModel } from "../models/Measurement.js";

export class MeasurementRepository {
    async getMeasurements(plantId : number, amount? : number) : Promise<IMeasurementDTO[] | null>{
        const result = await prisma.measurements.findMany({
            where: {fkUserPlantsId: plantId},
            take: amount? Number(amount): 5,
            orderBy: { timestamp: 'desc'}
        });

        if (!result) {
            return null;
        }
     
        const measurements: IMeasurementDTO[] = result.map((item : typeof result[number]) => {
            return {
                id: Number(item?.id),
                values: (item?.values as Record<string, any>) ?? {},
                timestamp: item?.timestamp ? new Date(item.timestamp) : new Date(),
                plantId: item?.fkUserPlantsId 
            };
        });
        
        return measurements;
    }
    
    async getById(id : number) : Promise<IMeasurementDTO | null> {
        const result = await prisma.measurements.findUnique({
            where: {id: id}
        });

        if (!result) {
            return null;
        }

        const measurement: IMeasurementDTO = {
            id: Number(result?.id),
            values: (result?.values as Record<string, any>) ?? {},
            timestamp: result?.timestamp ? new Date(result.timestamp) : new Date(),
            plantId: Number(result?.fkUserPlantsId)
        };
        
        return measurement;
    }

    async create(data: IMeasurementCreateModel) {
        try {
            const newMeasurements = await prisma.measurements.create({
                data: {
                    fkUserPlantsId: Number(data.plantId),
                    values: data.values as any,
                    timestamp: data.timestamp
                }
            });
    
            return !!newMeasurements;

        } catch (error) {
            console.error("Failed to create measurement:", error);
            return false;
        }
    }
}

export const measurementRepository = new MeasurementRepository();