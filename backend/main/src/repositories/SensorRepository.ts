import { prisma } from "../lib/prisma.js";
import type { ISensorCreateModel } from "../models/Sensor.js";
import type { ISensorDTO } from "@project/shared";

export class SensorRepository {
    async getSensors(plantId : number) : Promise<ISensorDTO[] | null>{
        const result = await prisma.sensors.findMany({
            where: {fkUserPlantsId: plantId}
        });

        if (!result) return null;

        const sensors: ISensorDTO[] = result.map((result) => {
            return {
                id: Number(result.id),
                userPlantId: Number(result.fkUserPlantsId),
                last_seen: result.lastSeen,
                online: result.online
            }
        });

        return sensors;
    }

    async getById(id : number) : Promise<ISensorDTO | null>{
        const result = await prisma.sensors.findUnique({
            where: {id: id}
        });

        if (!result) return null;

        const sensor: ISensorDTO = {
            id: result.id,
            userPlantId: Number(result.fkUserPlantsId),
            last_seen: result.lastSeen,
            online: result.online
        }

        return sensor;
    }

    async create(data : ISensorCreateModel) : Promise<boolean> {
        try {
            const newSensor = await prisma.sensors.create({
                data: {
                    lastSeen: new Date,
                    online: false,
                    fkUserPlantsId: data.userPlantId
                }
            });
    
            return !!newSensor;

        } catch (error) {
            console.error("Failed to create plant species:", error);
            return false;
        }
    }

    async delete(sensorId : number, userId : number) : Promise<boolean>{
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
            
        } catch (error) {
            console.error("Failed to delete sensor:", error);
            return false;
        }
    }
}

export const sensorRepository = new SensorRepository();