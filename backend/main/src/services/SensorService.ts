import type { ISensorDTO } from "@project/shared";
import { sensorRepository } from "../repositories/SensorRepository.js";

export class SensorService {
    async getSensors (plantId : number) : Promise<ISensorDTO[] | null> {
        // TODO

        const sensors = await sensorRepository.getSensors(plantId);
        
        return sensors;
    }

    async getById (sensorId : number) : Promise<ISensorDTO | null> {
        // TODO

        const sensor = await sensorRepository.getById(sensorId);
        
        return sensor;
    }

    async create (data : ISensorDTO) : Promise<boolean> {
        // TODO

        const response = await sensorRepository.create(data);
        
        return response;
    }

    async delete(sensorId : number, userId : number) : Promise<boolean>{
        // TODO

        const response = await sensorRepository.delete(sensorId, userId);

        return response;
    }
}

export const sensorService = new SensorService();