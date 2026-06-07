package config

import (
	"os"
)

type Config struct {
	AMQPURL                 string
	FirebaseCredentialsPath string
}

// LoadConfig reading .env
func LoadConfig() *Config {

	return &Config{
		AMQPURL:                 getEnv("RABBITMQ_URL_NOTIF", "amqp://guest:guest@localhost:5672/"),
		FirebaseCredentialsPath: getEnv("FIREBASE_CREDENTIALS_PATH", "./"),
	}
}

// default if env is empty
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
