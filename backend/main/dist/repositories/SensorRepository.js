import { prisma } from "../lib/prisma.js";
export class SensorRepository {
    async getSensors(plantId) {
        const result = await prisma.sensors.findMany({
            where: { fkUserPlantsId: plantId }
        });
        if (!result)
            return null;
        const sensors = result.map((item) => {
            return {
                id: Number(item.id),
                userPlantId: Number(item.fkUserPlantsId),
                last_seen: item.lastSeen,
                online: item.online
            };
        });
        return sensors;
    }
    async getById(id) {
        const result = await prisma.sensors.findUnique({
            where: { id: id }
        });
        if (!result)
            return null;
        const sensor = {
            id: result.id,
            userPlantId: Number(result.fkUserPlantsId),
            last_seen: result.lastSeen,
            online: result.online
        };
        return sensor;
    }
    async create(data) {
        try {
            const newSensor = await prisma.sensors.create({
                data: {
                    lastSeen: new Date,
                    online: false,
                    fkUserPlantsId: data.userPlantId
                }
            });
            return !!newSensor;
        }
        catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }
    async delete(sensorId, userId) {
        try {
            const deleteResult = await prisma.sensors.deleteMany({
                where: {
                    id: sensorId,
                    userPlants: {
                        fkUserId: userId
                    }
                },
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
}
export const sensorRepository = new SensorRepository();
