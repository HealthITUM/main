import { sensorRepository } from "../repositories/SensorRepository.js";
export class SensorService {
    async getSensors(plantId) {
        const sensors = await sensorRepository.getSensors(plantId);
        return sensors;
    }
    async getById(sensorId) {
        const sensor = await sensorRepository.getById(sensorId);
        return sensor;
    }
    async create(data) {
        // TODO
        const response = await sensorRepository.create(data);
        return response;
    }
    async delete(sensorId, userId) {
        const response = await sensorRepository.delete(sensorId, userId);
        return response;
    }
}
export const sensorService = new SensorService();
