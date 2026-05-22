import type { ISpecieCreateModel } from "../models/Species.js";
import type { IMeasurementCreateModel } from "../models/Measurement.js";
import { plantSpecieService } from "../services/PlantSpecieService.js";
import { measurementService } from "../services/MeasurementService.js";
import { AppQueue } from "./rabbit.queues.js";

type MessageHandler = (content: any) => Promise<void>;

export const queueHandlers: Record<AppQueue, MessageHandler> = {
  [AppQueue.ScrapperResult]: async (data) => {
    console.log('[Scrapper Handler] Data from:', data.name);

    const createData : ISpecieCreateModel = {
      name : data.name,
      description : data.description,
      ideal_values : data.ideal_values,
      imageUrl : data.imageUrl
    }

    const response = await plantSpecieService.create(createData);

    if (!response) {
      console.log("[Scrapper Handler] Failed to create new PlantSpecie.");
    } else {
      console.log("[Scrapper Handler] New specie successfuly added!");
    }
  },
  
  [AppQueue.PlantDetectionResult]: async (data) => {
    console.log('[PlantDetection Handler] Result:', data);
    // TODO
  },
  
  [AppQueue.SensorData]: async (data) => {
    console.log('[Sensor Handler] Data:', data);

    try {
      const createData : IMeasurementCreateModel = {
        internal_chip_id : data.internal_chip_id,
        values : data.ideal_values,
        timestamp : data.timestamp
      };

      const response = await measurementService.create(data);

      if (!response) {
        console.log("[Sensor Handler] Failed to create new Measurement.");
      } else {
        console.log("[Sensor Handler] New measurement successfuly added!");
      }
    } catch (error) {
      console.log('[Sensor Handler] Error:', error);
    }
  }
};