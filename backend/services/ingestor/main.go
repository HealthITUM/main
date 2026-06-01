package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	plantTimers = make(map[string]*time.Timer)
	timerMutex  = &sync.Mutex{}
	silenceTime = 30 * time.Second
)

var rmqChannel *amqp.Channel
var dataQueueName string
var statusQueueName string

type IncomingPayload struct {
	PlantID     string   `json:"plantId"`
	Light       *float64 `json:"light"`
	Moisture    *float64 `json:"moisture"`
	Temperature *float64 `json:"temperature"`
}

type OutgoingPayload struct {
	Type      string       `json:"type"`
	Timestamp string       `json:"timestamp"`
	Values    PlantMetrics `json:"values"`
	PlantID   int          `json:"plantId"`
}

type PlantMetrics struct {
	Moisture    float64 `json:"moisture"`
	Temperature float64 `json:"temperature"`
	Light       float64 `json:"light"`
}

type StatusAlertPayload struct {
	Type     string `json:"type"`
	Online   bool   `json:"online"`
	LastSeen string `json:"last_seen"`
	PlantID  int    `json:"plantId"`
}

func main() {
	envSilence := os.Getenv("RABBITMQ_SILENCE_TIME")
	if envSilence != "" {
		seconds, err := strconv.Atoi(envSilence)
		if err != nil {
			log.Printf("[WARN] Invalid RABBITMQ_SILENCE_TIME value '%s'. Defaulting to 30s.", envSilence)
		} else {
			silenceTime = time.Duration(seconds) * time.Second
			log.Printf("Watchdog silence timeout configured to: %s", silenceTime)
		}
	} else {
		log.Println("No RABBITMQ_SILENCE_TIME provided. Defaulting to 30s.")
	}

	dataQueueName = os.Getenv("RABBITMQ_DATA_QUEUE")
	if dataQueueName == "" {
		dataQueueName = "sensor.data.queue"
	}

	statusQueueName = os.Getenv("RABBITMQ_STATUS_QUEUE")
	if statusQueueName == "" {
		statusQueueName = "sensor.data.queue"
	}

	rabbitmqURL := os.Getenv("RABBITMQ_URL_SENSORS")
	if rabbitmqURL == "" {
		log.Println("[WARN] No RABBITMQ_URL found. Running in localized SANDBOX mode (Printing logs only).")
	} else {
		conn, err := amqp.Dial(rabbitmqURL)
		if err != nil {
			log.Fatalf("Failed to connect to RabbitMQ: %v", err)
		}
		defer conn.Close()

		rmqChannel, err = conn.Channel()
		if err != nil {
			log.Fatalf("Failed to open a RabbitMQ channel: %v", err)
		}
		defer rmqChannel.Close()

		log.Println("Successfully connected to RabbitMQ and verified queue:", dataQueueName)
	}

	mosquittoURL := os.Getenv("MOSQUITTO_URL")
	if mosquittoURL == "" {
		mosquittoURL = "tcp://localhost:1883"
	}
	mosquittoPass := os.Getenv("MOSQUITTO_PASSWORD")

	opts := mqtt.NewClientOptions().AddBroker(mosquittoURL)
	opts.SetUsername(os.Getenv("MOSQUITTO_USER"))
	if mosquittoPass != "" {
		opts.SetPassword(mosquittoPass)
	}
	opts.SetDefaultPublishHandler(onMessageReceived)

	mqttClient := mqtt.NewClient(opts)

	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("Failed to connect to Mosquitto: %v", token.Error())
	}
	defer mqttClient.Disconnect(250)

	topic := "sensors/#"
	if token := mqttClient.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		log.Fatalf("Failed to subscribe to topic: %v", token.Error())
	}

	fmt.Printf("Go Sandbox Active! Listening to Mosquitto on: %s\n", topic)
	fmt.Println("Awaiting ESP32 payloads... Press CTRL+C to exit.")

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
}

func onMessageReceived(client mqtt.Client, msg mqtt.Message) {
	currentTopic := msg.Topic()
	payloadStr := string(msg.Payload())

	parts := strings.Split(currentTopic, "/")
	if len(parts) < 3 {
		log.Printf("[WARN] Dropping malformed topic path: %s", currentTopic)
		return
	}

	actionType := parts[1]
	plantIDStr := parts[2]
	plantId := strings.TrimPrefix(plantIDStr, "Plant_")

	if actionType == "status" {
		if payloadStr == "online" {
			plantIdInt, err := strconv.Atoi(plantId)
			if err != nil {
				log.Printf("[WARN] Cannot parse plantId '%s' as int, dropping message", plantId)
				return
			}
			log.Printf("[STATUS] %s is ONLINE. Starting watchdog timer.", plantId)
			resetWatchdogTimer(plantId)

			if rmqChannel != nil {
				onlineAlert := StatusAlertPayload{
					Type:     "status",
					Online:   true,
					LastSeen: time.Now().UTC().Format(time.RFC3339),
					PlantID:  plantIdInt,
				}
				finalJSON, _ := json.Marshal(onlineAlert)

				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				err := rmqChannel.PublishWithContext(ctx, "amq.topic", "sensor.data.status", false, false,
					amqp.Publishing{
						ContentType: "application/json",
						Body:        finalJSON,
					},
				)
				cancel()

				if err != nil {
					log.Printf("[ERROR] Failed to send online alert to RabbitMQ: %v", err)
				} else {
					log.Printf("[SUCCESS] Sent online status alert for Plant #%s to %s", plantId, statusQueueName)
				}
			}
		} else if payloadStr == "offline" {
			log.Printf("[STATUS] %s went OFFLINE. Triggering alert pipeline.", plantId)
			stopWatchdogTimer(plantId)
			handlePlantSilence(plantId)
		}
		return
	}

	if actionType == "data" {
		var input IncomingPayload

		if err := json.Unmarshal(msg.Payload(), &input); err != nil {
			log.Printf("[REJECTED] %s - Corrupt telemetry JSON structure", currentTopic)
			return
		}

		resetWatchdogTimer(plantId)
		input.PlantID = plantId

		if err := validateIncoming(input); err != nil {
			log.Printf("[REJECTED] %s - Validation failure: %v", currentTopic, err)
			return
		}

		plantIdInt, err := strconv.Atoi(plantId)
		if err != nil {
			log.Printf("[WARN] Cannot parse plantId '%s' as int, dropping message", plantId)
			return
		}

		output := OutgoingPayload{
			PlantID:   plantIdInt,
			Type:      actionType,
			Timestamp: time.Now().UTC().Format(time.RFC3339),
			Values: PlantMetrics{
				Moisture:    *input.Moisture,
				Temperature: *input.Temperature,
				Light:       *input.Light,
			},
		}

		finalJSON, err := json.MarshalIndent(output, "", "  ")
		if err != nil {
			log.Printf("[ERROR] Failed to compile outgoing JSON: %v", err)
			return
		}

		if rmqChannel != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			err = rmqChannel.PublishWithContext(ctx, "amq.topic", "sensor.data.telemetry", false, false,
				amqp.Publishing{
					ContentType: "application/json",
					Body:        finalJSON,
				},
			)
			if err != nil {
				log.Printf("[ERROR] Failed to publish message to RabbitMQ: %v", err)
			} else {
				log.Printf("[SUCCESS] Forwarded telemetry from %s directly to queue %s.", plantId, dataQueueName)
			}
		} else {
			log.Println("[SANDBOX MODE] Transformed payload:")
			fmt.Println(string(finalJSON))
		}
	}
}

func validateIncoming(p IncomingPayload) error {
	if p.Temperature == nil || p.Moisture == nil || p.Light == nil {
		return fmt.Errorf("missing structural metric values; payload keys are corrupt or incomplete")
	}

	if *p.Temperature < -40.0 || *p.Temperature > 80.0 {
		return fmt.Errorf("temperature out of bounds: %0.2f", *p.Temperature)
	}
	if *p.Moisture < 0.0 || *p.Moisture > 100.0 {
		return fmt.Errorf("moisture percentage out of bounds: %0.2f", *p.Moisture)
	}
	// FIX: Corrected field logging output references here
	if *p.Light < 0.0 || *p.Light > 100000.0 {
		return fmt.Errorf("light levels out of bounds: %0.2f", *p.Light)
	}

	return nil
}

func resetWatchdogTimer(plantId string) {
	timerMutex.Lock()
	defer timerMutex.Unlock()

	if oldTimer, exists := plantTimers[plantId]; exists {
		oldTimer.Stop()
	}

	plantTimers[plantId] = time.AfterFunc(silenceTime, func() {
		handlePlantSilence(plantId)
	})
}

func stopWatchdogTimer(plantId string) {
	timerMutex.Lock()
	defer timerMutex.Unlock()

	if oldTimer, exists := plantTimers[plantId]; exists {
		oldTimer.Stop()
		delete(plantTimers, plantId)
	}
}

func handlePlantSilence(plantId string) {
	if rmqChannel != nil {
		plantIdInt, err := strconv.Atoi(plantId)
		if err != nil {
			log.Printf("[WARN] Cannot parse plantId '%s' as int, dropping message", plantId)
			return
		}

		alert := StatusAlertPayload{
			Type:     "status",
			Online:   false,
			LastSeen: time.Now().UTC().Format(time.RFC3339),
			PlantID:  plantIdInt,
		}

		finalJSON, err := json.Marshal(alert)
		if err != nil {
			log.Printf("[ERROR] Failed to marshal status alert: %v", err)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = rmqChannel.PublishWithContext(ctx, "amq.topic", "sensor.data.status", false, false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        finalJSON,
			},
		)

		if err != nil {
			log.Printf("[ERROR] Failed to forward alert payload to RabbitMQ: %v", err)
		} else {
			log.Printf("[SUCCESS] Sent offline status alert for Plant #%s to queue %s", plantId, statusQueueName)
		}
	}
}
