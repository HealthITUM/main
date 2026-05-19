import type { IMeasurementDTO } from "@project/shared";
import { measurementRepository } from "../repositories/MeasurementRepository.js";

export class MeasurementService {
    async getMeasurements (plantId : number) : Promise<IMeasurementDTO[] | null> {
        // TODO

        var amount = 10;
        const measurements = await measurementRepository.getMeasurements(plantId, amount);

        return measurements;
    }
    async getById (measurementId : number) : Promise<IMeasurementDTO | null> {
        // TODO

        const measurement = await measurementRepository.getById(measurementId);

        return measurement;
    }
}

export const measurementService = new MeasurementService();