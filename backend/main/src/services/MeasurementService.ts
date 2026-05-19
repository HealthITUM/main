import type { IMeasurementDTO } from "@project/shared";
import { measurementRepository } from "../repositories/MeasurementRepository.js";

export class MeasurementService {
    async getMeasurements (plantId : number) : Promise<Array<IMeasurementDTO>> {
        // TODO

        var amount = 10;
        const measurements = await measurementRepository.getMeasurements(amount, plantId);

        return measurements;
    }
    async getMeasurementById (measurementId : number) : Promise<IMeasurementDTO> {
        // TODO

        const measurement = await measurementRepository.getById(measurementId);
        
        return measurement;
    }
}

export const measurementService = new MeasurementService();