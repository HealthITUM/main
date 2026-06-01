package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	amqp "github.com/rabbitmq/amqp091-go"
)

type IdealValues struct {
	Moisture    int `json:"moisture"`
	Temperature int `json:"temperature"`
	LightLevel  int `json:"light_level"`
}

type Plant struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	ImageURL    string      `json:"image_url"`
	IdealValues IdealValues `json:"ideal_values"`
}

type PlantMessage struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	ImageURL    string      `json:"imageUrl"`
	IdealValues IdealValues `json:"ideal_values"`
}

func uploadToMinio(client *minio.Client, imageURL string, plantName string) (string, error) {
	resp, err := http.Get(imageURL)
	if err != nil {
		return "", fmt.Errorf("failed to download image: %v", err)
	}
	defer resp.Body.Close()

	ext := filepath.Ext(imageURL)
	if ext == "" || len(ext) > 5 {
		ext = ".jpg"
	}
	if idx := strings.Index(ext, "?"); idx != -1 {
		ext = ext[:idx]
	}

	objectName := fmt.Sprintf("%s_%d%s",
		strings.ReplaceAll(strings.ToLower(plantName), " ", "_"),
		time.Now().UnixNano(),
		ext,
	)

	bucket := os.Getenv("S3_BUCKET_SPECIES")
	if bucket == "" {
		bucket = "species"
	}

	_, err = client.PutObject(
		context.Background(),
		bucket,
		objectName,
		resp.Body,
		resp.ContentLength,
		minio.PutObjectOptions{ContentType: resp.Header.Get("Content-Type")},
	)
	if err != nil {
		return "", fmt.Errorf("failed to upload to minio: %v", err)
	}

	return fmt.Sprintf("%s/%s", bucket, objectName), nil
}

func publishToRabbitMQ(ch *amqp.Channel, plant PlantMessage) error {
	body, err := json.Marshal(plant)
	if err != nil {
		return err
	}

	return ch.PublishWithContext(
		context.Background(),
		"amq.topic",          // exchange
		"scrapper.result.ok", // routing key
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}
func connectRabbitMQ(url string) (*amqp.Connection, *amqp.Channel, error) {
	maxRetries := 5
	delay := 3 * time.Second

	for i := 0; i < maxRetries; i++ {
		conn, err := amqp.Dial(url)
		if err != nil {
			log.Printf("[RabbitMQ] Attempt %d/%d failed, retrying in %v...", i+1, maxRetries, delay)
			time.Sleep(delay)
			continue
		}

		ch, err := conn.Channel()
		if err != nil {
			conn.Close()
			log.Printf("[RabbitMQ] Failed to open channel, retrying...")
			time.Sleep(delay)
			continue
		}

		return conn, ch, nil
	}

	return nil, nil, fmt.Errorf("failed to connect to RabbitMQ after %d retries", maxRetries)
}

func main() {
	minioEndpoint := fmt.Sprintf("%s:%s", os.Getenv("MINIO_ENDPOINT"), os.Getenv("MINIO_PORT"))
	if minioEndpoint == ":" {
		minioEndpoint = "localhost:9000"
	}
	minioClient, err := minio.New(minioEndpoint, &minio.Options{
		Creds: credentials.NewStaticV4(
			os.Getenv("MINIO_ROOT_USER"),
			os.Getenv("MINIO_ROOT_PASSWORD"),
			"",
		),
		Secure: os.Getenv("MINIO_USE_SSL") == "true",
	})
	if err != nil {
		log.Fatalf("Failed to init MinIO client: %v", err)
	}

	rabbitURL := os.Getenv("RABBITMQ_URL_SCRAPPER")
	if rabbitURL == "" {
		log.Fatalf("Failed to connect to RabbitMQ")
	}

	conn, ch, err := connectRabbitMQ(rabbitURL)
	if err != nil {
		log.Fatalf("%v", err)
	}
	defer conn.Close()
	defer ch.Close()

	data, err := os.ReadFile("plants_dataset.json")
	if err != nil {
		log.Fatalf("Failed to read plants_dataset.json: %v", err)
	}

	var plants []Plant
	if err := json.Unmarshal(data, &plants); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	fmt.Printf("[FETCHER] Loaded %d plants. Starting upload...\n\n", len(plants))

	for i, plant := range plants {
		fmt.Printf("[%d/%d] Processing: %s\n", i+1, len(plants), plant.Name)

		minioPath, err := uploadToMinio(minioClient, plant.ImageURL, plant.Name)
		if err != nil {
			log.Printf("[SKIP] %s — image upload failed: %v\n", plant.Name, err)
			continue
		}

		publicHost := os.Getenv("MINIO_PUBLIC_URL")
		if publicHost == "" {
			log.Printf("Failed to connect to RabbitMQ")
		}

		msg := PlantMessage{
			Name:        plant.Name,
			Description: plant.Description,
			ImageURL:    minioPath,
			IdealValues: plant.IdealValues,
		}

		if err := publishToRabbitMQ(ch, msg); err != nil {
			log.Printf("[ERROR] %s — failed to publish: %v\n", plant.Name, err)
			continue
		}

		fmt.Printf("[OK] %s → %s\n", plant.Name, msg.ImageURL)
		time.Sleep(100 * time.Millisecond)
	}

	fmt.Printf("\n[DONE] Processed %d plants.\n", len(plants))
}
