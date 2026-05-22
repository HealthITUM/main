import { AppQueue } from "./rabbit.queues.js";

type MessageHandler = (content: any) => Promise<void>;

export const queueHandlers: Record<AppQueue, MessageHandler> = {
  [AppQueue.ScrapperResult]: async (data) => {
    console.log('[Scrapper Handler] Result:', data);
    // TODO
  },
  
  [AppQueue.PlantDetectionResult]: async (data) => {
    console.log('[PlantDetection Handler] Result:', data);
    // TODO
  },
  
  [AppQueue.SensorData]: async (data) => {
    console.log('[Sensor Handler] Data:', data);
    // TODO
  }
};