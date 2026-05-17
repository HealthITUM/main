import type { ISensorDTO } from "@project/shared";

export class SensorRepository {
    async getSensors(plantId : Number, amount? : Number){
        // TODO
        
    }

    async getById(id : Number){
        // TODO

    }

    async create(data : ISensorDTO) {
        // TODO

    }

    async delete(id : Number){
        // TODO

    }
}

export const sensorRepository = new SensorRepository();