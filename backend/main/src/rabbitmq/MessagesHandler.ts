import type { ISpecieCreateModel } from "../models/Species.js";
import type { IMeasurementCreateModel } from "../models/Measurement.js";
import { plantSpecieService } from "../services/PlantSpecieService.js";
import { measurementService } from "../services/MeasurementService.js";
import { AppQueue } from "./rabbit.queues.js";
import { userService } from "../services/UserService.js";

type MessageHandler = (content: any) => Promise<void>;

export const queueHandlers: Record<AppQueue, MessageHandler> = {
  [AppQueue.ScrapperResult]: async (data) => {
    console.log('[Scrapper Handler] Data from:', data.name);

    try {
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
    } catch (error) {
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
      const createData : IMeasurementCreateModel = {
        plantId : data.plantId,
        values : data.values,
        timestamp : data.timestamp
      };

      const response = await measurementService.create(createData);

      if (!response) {
        console.log("[Sensor Handler] Failed to create new Measurement.");
      } else {
        console.log("[Sensor Handler] New measurement successfuly added!");
      }
    } catch (error) {
      console.log('[Sensor Handler] Error:', error);
    }
  },

  [AppQueue.NotificationErrors]: async (data) => {
    console.log('[Notifications Errors Handler] Data:', data);

    try {
      const userId : number = data.user_id;

      if (!userId) {
        console.log('[Notifications Errors Handler] UserID came empty.')
      } else {
          const response = await userService.removeFcmToken(userId);
          
          if (!response) {
            console.log("[Notifications Errors Handler] Failed to remove FCM Token from user: ", userId);
          } else {
            console.log("[Notifications Errors Handler] Token removed.");
          }
      }
    } catch (error) {
      console.log('[Notifications Errors Handler] Error:', error);
    }
  }
};