import type { ISensorDTO } from "@project/shared";

export class SensorRepository {
    async getSensors(plantId : number, amount? : number) : Promise<ISensorDTO[] | null>{
        // TODO
        return null;
    }

    async getById(id : number) : Promise<ISensorDTO | null>{
        // TODO
        return null;
    }

    async create(data : ISensorDTO) : Promise<boolean> {
        // TODO
        return false;
    }

    async delete(sensorId : number, userId : number) : Promise<boolean>{
        // TODO
        return false;
    }
}

export const sensorRepository = new SensorRepository();