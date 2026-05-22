import type { IMeasurementDTO } from "@project/shared";
import type { IMeasurementCreateModel } from "../models/Measurement.js";

export class MeasurementRepository {
    async getMeasurements(plantId : number, amount? : number) : Promise<IMeasurementDTO[] | null>{
        // TODO
        return null;
    }
    
    async getById(id : number) : Promise<IMeasurementDTO | null> {
        // TODO
        return null;
    }

    async create(data : IMeasurementCreateModel) : Promise<boolean> {
        // TODO
        return false;
    }
}

export const measurementRepository = new MeasurementRepository();