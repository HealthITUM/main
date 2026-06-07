import amqp from 'amqplib';
import { queueHandlers } from "../rabbitmq/MessagesHandler.js";
import { AppQueue } from '../rabbitmq/rabbit.queues.js';
export class QueueService {
    connection;
    channel = null;
    exchangeName = 'amq.topic';
    async init() {
        if (this.channel)
            return;
        try {
            const rabbitUrl = process.env.RABBITMQ_URL_MONOLITH;
            this.connection = await amqp.connect(rabbitUrl);
            this.channel = await this.connection.createChannel();
            console.log("[RabbitMQ] RabbitMQ initialized!");
            await this.startConsuming();
        }
        catch (error) {
            console.error('[RabbitMQ] Initialization error RabbitMQ:', error);
            throw error;
        }
    }
    isInit() {
        return (this.channel);
    }
    async publish(routingKey, message) {
        if (!this.channel) {
            console.error('[QueueService] ERROR: Sending message before initialization.');
            return false;
        }
        try {
            const payload = Buffer.from(JSON.stringify(message));
            // publish to exchanger, not to the queue.
            const published = this.channel.publish(this.exchangeName, routingKey, payload, {
                persistent: true
            });
            console.log(`[QueueService] Message sent. Key: [${routingKey}]`);
            return published;
        }
        catch (error) {
            console.error('[QueueService] Error while sending the message:', error);
            return false;
        }
    }
    async startConsuming() {
        if (!this.channel)
            return;
        // Checking all the queues in ENUM.
        for (const queueName of Object.values(AppQueue)) {
            await this.channel.consume(queueName, async (msg) => {
                if (msg !== null) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        // Getting right handler from queuehandler
                        const handler = queueHandlers[queueName];
                        if (handler) {
                            await handler(content);
                        }
                        else {
                            console.warn(`No handler for queue: ${queueName}`);
                        }
                        // saying to rabbitMQ that everything is OK.
                        this.channel?.ack(msg);
                    }
                    catch (err) {
                        console.error(`[RabbitMQ] Error handling message from queue: ${queueName}:`, err);
                        // Bad message- getting rid of it from RabbitMQ.
                        this.channel?.nack(msg, false, false);
                    }
                }
            });
            console.log(`[QueueService] Listening to the queue: ${queueName}`);
        }
    }
}
export const queueService = new QueueService();
