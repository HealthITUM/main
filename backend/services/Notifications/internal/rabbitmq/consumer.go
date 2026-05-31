package rabbitmq

import (
	"encoding/json"
	"log"

	"notification-service/internal/config"
	"notification-service/internal/models"
	"notification-service/internal/push"

	amqp "github.com/rabbitmq/amqp091-go"
)

// connect to rabbitmq and listen to queue
func StartConsumer(cfg *config.Config) {
	conn, err := amqp.Dial(cfg.AMQPURL)
	if err != nil {
		log.Panicf("[NotificationMicroService] Failed to connect to RabbitMQ: %s", err)
	}

	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Panicf("[NotificationMicroService] Failed to open a channel: %s", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclarePassive(
		models.QueueTaskName, // имя очереди
		true,                 // durable
		false,                // delete when unused
		false,                // exclusive
		false,                // no-wait
		nil,                  // arguments
	)
	if err != nil {
		log.Panicf("[NotificationMicroService] Failed to declare a queue: %s", err)
	}

	err = ch.Qos(1, 0, false)
	if err != nil {
		log.Panicf("[NotificationMicroService] Failed to set QoS: %s", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false, // auto-ack: false (accept manualy)
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Panicf("[NotificationMicroService] Failed to register a consumer: %s", err)
	}

	log.Printf("[NotificationMicroService] [*] Notifications Service is running. Waiting for messages...")

	for d := range msgs {
		log.Printf(" [x] Received raw bytes: %s", d.Body)

		var notif models.NotificationPayload
		err := json.Unmarshal(d.Body, &notif)
		if err != nil {
			log.Printf(" [!] Error parsing JSON: %s. Message dropped.", err)
			d.Ack(false)
			continue
		}

		log.Printf(" [->] Processing notification for User ID: %d", notif.UserID)

		isInvalidToken := push.SendFirebasePush(notif)

		if isInvalidToken {
			log.Printf(" [!] Token is bad. Redirecting to monolith error queue...")

			sendToMonolithErrorQueue(ch, notif.UserID)

			d.Ack(false)
			continue
		}

		err = d.Ack(false)
		if err != nil {
			log.Printf("Failed to acknowledge message: %s", err)
		}
	}
}
