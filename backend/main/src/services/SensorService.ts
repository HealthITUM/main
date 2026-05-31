import type { ISensorDTO } from "@project/shared";
import { sensorRepository } from "../repositories/SensorRepository.js";
import type { ISensorCreateModel, ISensorUpdateModel } from "../models/Sensor.js";

export class SensorService {
    async getSensors (plantId : number) : Promise<ISensorDTO[] | null> {
        const sensors = await sensorRepository.getSensors(plantId);
        
        return sensors;
    }

    async getById (sensorId : number) : Promise<ISensorDTO | null> {
        const sensor = await sensorRepository.getById(sensorId);
        
        return sensor;
    }

    async updateSensorStatus(data : ISensorUpdateModel) : Promise<boolean> {
        const response = await sensorRepository.update(data);
        
        return response;
    }

    async create (data : ISensorCreateModel) : Promise<boolean> {
        const userPlantHasSensor : boolean = await sensorRepository.userPlantHasSensor(data.userPlantId);

        if (userPlantHasSensor) {
            return false;
        }

        const response = await sensorRepository.create(data);
        
        return response;
    }

    async delete(sensorId : number) : Promise<boolean>{
        const response = await sensorRepository.delete(sensorId);

        return response;
    }
}

export const sensorService = new SensorService();