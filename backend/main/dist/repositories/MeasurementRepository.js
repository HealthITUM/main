import { prisma } from "../lib/prisma.js";
export class MeasurementRepository {
    async getMeasurements(plantId, amount) {
        const result = await prisma.measurements.findMany({
            where: { fkUserPlantsId: plantId },
            take: amount ? Number(amount) : 5,
            orderBy: { timestamp: 'desc' }
        });
        if (!result) {
            return null;
        }
        const measurements = result.map((item) => {
            return {
                id: Number(item?.id),
                values: item?.values ?? {},
                timestamp: item?.timestamp ? new Date(item.timestamp) : new Date(),
                plantId: item?.fkUserPlantsId
            };
        });
        return measurements;
    }
    async getById(id) {
        const result = await prisma.measurements.findUnique({
            where: { id: id }
        });
        if (!result) {
            return null;
        }
        const measurement = {
            id: Number(result?.id),
            values: result?.values ?? {},
            timestamp: result?.timestamp ? new Date(result.timestamp) : new Date(),
            plantId: Number(result?.fkUserPlantsId)
        };
        return measurement;
    }
    async create(data) {
        try {
            const newMeasurements = await prisma.measurements.create({
                data: {
                    fkUserPlantsId: Number(data.plantId),
                    values: data.values,
                    timestamp: data.timestamp
                }
            });
            return !!newMeasurements;
        }
        catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }
}
export const measurementRepository = new MeasurementRepository();
