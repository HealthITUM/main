import type { ISensorDTO } from "@project/shared";
import { sensorRepository } from "../repositories/SensorRepository.js";

export class SensorService {
    async getSensors (plantId : Number) {
        // TODO

        var amount = 10;
        sensorRepository.getSensors(plantId, amount); 
    }

    async getById (sensorId : Number) {
        // TODO

        sensorRepository.getById(sensorId);
    }

    async create (data : ISensorDTO){
        // TODO

        sensorRepository.create(data);
    }

    async delete(id : Number){
        // TODO

        sensorRepository.delete(id);
    }
}

export const sensorService = new SensorService();