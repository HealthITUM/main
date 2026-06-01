package rabbitmq

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"notification-service/internal/models"

	amqp "github.com/rabbitmq/amqp091-go"
)

func sendToMonolithErrorQueue(ch *amqp.Channel, userID int) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	body, _ := json.Marshal(map[string]int{"userId": userID})

	err := ch.PublishWithContext(ctx,
		"amq.topic",
		models.QueueErrorName,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			DeliveryMode: amqp.Persistent,
		},
	)
	if err != nil {
		log.Printf("[RabbitMQ] CRITICAL: Failed to push invalid token message to monolith queue: %s", err)
	} else {
		log.Printf("[RabbitMQ] Invalid token event sent to %s", models.QueueErrorName)
	}
}
