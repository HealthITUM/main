package push

import (
	"context"
	"log"
	"strings"
	"time"

	"notification-service/internal/config"
	"notification-service/internal/models"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

// Global Firebase client
var fcmClient *messaging.Client

// InitFirebase init of firebase at the start of service
func InitFirebase(cfg *config.Config) {
	ctx := context.Background()

	// load json
	opt := option.WithCredentialsFile(cfg.FirebaseCredentialsPath)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Panicf("[Firebase] Error initializing app: %s", err)
	}

	// client for sending
	fcmClient, err = app.Messaging(ctx)
	if err != nil {
		log.Panicf("[Firebase] Error getting Messaging client: %s", err)
	}

	log.Println("[Firebase] Successfully initialized Firebase Admin SDK")
}

// SendFirebasePush push notification and return boolean:
// true — token NOT valid
// false — any other case
func SendFirebasePush(notif models.NotificationPayload) bool {
	if fcmClient == nil {
		log.Printf("[Firebase] CRITICAL: FCM client is not initialized.")
		return false
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 1. structure for sending data
	message := &messaging.Message{
		Token: notif.Token,
		Notification: &messaging.Notification{
			Title: notif.Title,
			Body:  notif.Body,
		},
	}

	// 2. sending push Firebase
	_, err := fcmClient.Send(ctx, message)
	if err != nil {
		// 3. IF TOKEN IS NOT VALID
		if messaging.IsUnregistered(err) ||
			messaging.IsInvalidArgument(err) ||
			strings.Contains(err.Error(), "not a valid FCM registration token") {
			log.Printf("[Firebase] Token is INVALID for User %d. Routing back to monolith...", notif.UserID)
			return true
		}

		// if token valid but still mistake, just logging in this and continue
		log.Printf("[Firebase] Temporary error sending message to User %d: %s", notif.UserID, err)
		log.Printf("[Firebase] Error type: %T, value: %v", err, err)
		return false
	}

	log.Printf("[Firebase] Push successfully sent to User %d", notif.UserID)
	return false
}
