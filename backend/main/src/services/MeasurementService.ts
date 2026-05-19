import { measurementRepository } from "../repositories/MeasurementRepository.js";

export class MeasurementService {
    async getMeasurements (plantId : number) {
        // TODO

        var amount = 10;
        measurementRepository.getMeasurements(amount, plantId); 
    }
    async getMeasurementById (measurementId : number) {
        // TODO

        measurementRepository.getById(measurementId);
    }
}

export const measurementService = new MeasurementService();