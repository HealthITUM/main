import type { IMeasurementDTO } from "@project/shared";

export class MeasurementRepository {
    async getMeasurements(plantId : number, amount? : number) : Promise<IMeasurementDTO[] | null>{
        // TODO
        return null;
    }
    
    async getById(id : number) : Promise<IMeasurementDTO | null> {
        // TODO
        return null;
    }
}

export const measurementRepository = new MeasurementRepository();