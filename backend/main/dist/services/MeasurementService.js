import { measurementRepository } from "../repositories/MeasurementRepository.js";
export class MeasurementService {
    async getMeasurements(plantId) {
        var amount = 10;
        const measurements = await measurementRepository.getMeasurements(plantId, amount);
        return measurements;
    }
    async getById(measurementId) {
        const measurement = await measurementRepository.getById(measurementId);
        return measurement;
    }
    async create(data) {
        const response = await measurementRepository.create(data);
        return response;
    }
}
export const measurementService = new MeasurementService();
