import { prisma } from "../lib/prisma.js";
import type { ISensorCreateModel, ISensorUpdateModel } from "../models/Sensor.js";
import type { ISensorDTO } from "@project/shared";

export class SensorRepository {
    async getSensors(plantId : number) : Promise<ISensorDTO[] | null>{
        const result = await prisma.sensors.findMany({
            where: {fkUserPlantsId: plantId}
        });

        if (!result) return null;

        const sensors: ISensorDTO[] = result.map((item : typeof result[number]) => {
            return {
                id: Number(item.id),
                userPlantId: Number(item.fkUserPlantsId),
                last_seen: item.lastSeen,
                online: item.online
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

    async userPlantHasSensor(userPlantId : number) : Promise<boolean> {
        try {
            const userPlant = await prisma.sensors.findUnique({
                where : {
                    fkUserPlantsId: userPlantId
                }
            });

            if (!userPlant) {
                return false;
            }
            console.log("User Plant already have a sensor.");
            return true;
        } catch (error) {
            console.error("Failed find sensor with that id:", error);
            return false;
        }
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
            console.error("Failed to create sensor:", error);
            return false;
        }
    }

    async update(data : ISensorUpdateModel) : Promise<boolean> {
        try {
            const newSensor = await prisma.sensors.update({
                where: {
                    fkUserPlantsId: data.userPlantId
                },
                data: {
                    online : data.online,
                    lastSeen : data.last_seen
                }
            });
    
            return !!newSensor;

        } catch (error) {
            console.error("Failed to update sensor:", error);
            return false;
        }
    }

    async delete(sensorId : number) : Promise<boolean>{
        try {
            const deleteResult = await prisma.sensors.deleteMany({
              where: {
                id: sensorId
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