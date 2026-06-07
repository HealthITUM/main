import { rabbitService } from "../services/RabbitMqService.js";
import { RoutingKey } from "./rabbit.queues.js";
import type { INotificationDataModel, IPlantDetectionTaskModel } from "../models/RabbitMqModels.js";

export const queueSenders = {

    async sendNotification(data: INotificationDataModel): Promise<boolean> {
        console.log(`[QueueSenders] Routing push task for user: ${data.userId}`);
        return rabbitService.publish(RoutingKey.NotificationData, data);
    },

    async sendScrapperTask(data: any): Promise<boolean> {
        console.log(`[QueueSenders] Routing task to Scrapper`);
        return rabbitService.publish(RoutingKey.ScrapperTask, data);
    },

    async sendPlantDetectionTask(data: IPlantDetectionTaskModel): Promise<boolean> {
        console.log(`[QueueSenders] Routing task to Plant Detection`);
        return rabbitService.publish(RoutingKey.PlantDetectionTasks, data);
    }
};