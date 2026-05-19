import type { ISensorDTO } from "@project/shared";
import { sensorRepository } from "../repositories/SensorRepository.js";

export class SensorService {
    async getSensors (plantId : number) {
        // TODO

        var amount = 10;
        sensorRepository.getSensors(plantId, amount); 
    }

    async getById (sensorId : number) {
        // TODO

        sensorRepository.getById(sensorId);
    }

    async create (data : ISensorDTO){
        // TODO

        sensorRepository.create(data);
    }

    async delete(id : number){
        // TODO

        sensorRepository.delete(id);
    }
}

export const sensorService = new SensorService();