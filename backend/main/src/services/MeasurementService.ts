import { measurementRepository } from "../repositories/MeasurementRepository.js";

export class MeasurementService {
    async getMeasurements (plantId : Number) {
        // TODO

        var amount = 10;
        measurementRepository.getMeasurements(amount, plantId); 
    }
    async getMeasurementById (measurementId : Number) {
        // TODO

        measurementRepository.getById(measurementId);
    }
}

export const measurementService = new MeasurementService();