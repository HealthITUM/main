package main

import (
	"log"
	"notification-service/internal/config"
	"notification-service/internal/push"
	"notification-service/internal/rabbitmq"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	log.Println("[Main] Starting Notification Microservice...")

	cfg := config.LoadConfig()

	push.InitFirebase(cfg)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		rabbitmq.StartConsumer(cfg)
	}()

	log.Println("[Main] Microservice is successfully initialized and running.")
	<-stop
	log.Println(" [-] Shutting down Notifications Service gracefully...")
	log.Println(" [v] Microservice stopped.")
}
