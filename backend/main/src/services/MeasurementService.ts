import type { IMeasurementDTO } from "@project/shared";
import { measurementRepository } from "../repositories/MeasurementRepository.js";
import { userRepository } from "../repositories/UserRepository.js";
import { userPlantRepository } from "../repositories/UserPlantRepository.js";
import type { IMeasurementCreateModel } from "../models/Measurement.js";
import { plantSpecieRepository } from "../repositories/PlantSpecieRepository.js";

export class MeasurementService {
    async getMeasurements (plantId : number) : Promise<IMeasurementDTO[] | null> {
        var amount = 10;
        const measurements = await measurementRepository.getMeasurements(plantId, amount);

        return measurements;
    }

    async getById (measurementId : number) : Promise<IMeasurementDTO | null> {
        const measurement = await measurementRepository.getById(measurementId);

        return measurement;
    }

    async create(data: IMeasurementCreateModel): Promise<boolean> {
        // TODO - NOTIFICATION AND COMPARE IDEAL VS MEASUREMENT VALUES
        const response = await measurementRepository.create(data);
        return response;
    }
}

export const measurementService = new MeasurementService();