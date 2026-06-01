import { plantSpecieService } from "../services/PlantSpecieService.js";
import { measurementService } from "../services/MeasurementService.js";
import { AppQueue } from "./rabbit.queues.js";
export const queueHandlers = {
    [AppQueue.ScrapperResult]: async (data) => {
        console.log('[Scrapper Handler] Data from:', data.name);
        try {
            const createData = {
                name: data.name,
                description: data.description,
                ideal_values: data.ideal_values,
                imageUrl: data.imageUrl
            };
            const response = await plantSpecieService.create(createData);
            if (!response) {
                console.log("[Scrapper Handler] Failed to create new PlantSpecie.");
            }
            else {
                console.log("[Scrapper Handler] New specie successfuly added!");
            }
        }
        catch (error) {
            console.log('[Scrapper Handler] Error:', error);
        }
    },
    [AppQueue.PlantDetectionResult]: async (data) => {
        console.log('[PlantDetection Handler] Result:', data);
        // TODO
    },
    [AppQueue.SensorData]: async (data) => {
        console.log('[Sensor Handler] Data:', data);
        try {
            const createData = {
                plantId: data.plantId,
                values: data.ideal_values,
                timestamp: data.timestamp
            };
            const response = await measurementService.create(createData);
            if (!response) {
                console.log("[Sensor Handler] Failed to create new Measurement.");
            }
            else {
                console.log("[Sensor Handler] New measurement successfuly added!");
            }
        }
        catch (error) {
            console.log('[Sensor Handler] Error:', error);
        }
    }
};
