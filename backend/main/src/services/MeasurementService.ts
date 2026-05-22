import type { IMeasurementDTO } from "@project/shared";
import { measurementRepository } from "../repositories/MeasurementRepository.js";
import type { IMeasurementCreateModel } from "../models/Measurement.js";

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

    async create(data : IMeasurementCreateModel) : Promise<boolean> {
        // TODO

        const response = await measurementRepository.create(data);
        return response;
    }
}

export const measurementService = new MeasurementService();