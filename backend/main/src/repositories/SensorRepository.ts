import type { ISensorDTO } from "@project/shared";

export class SensorRepository {
    async getSensors(plantId : number, amount? : number){
        // TODO
        
    }

    async getById(id : number){
        // TODO

    }

    async create(data : ISensorDTO) {
        // TODO

    }

    async delete(id : number){
        // TODO

    }
}

export const sensorRepository = new SensorRepository();