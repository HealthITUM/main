package models

// NotificationPayload полностью повторяет контракт из монолита
type NotificationPayload struct {
	UserID int    `json:"userId"`
	Token  string `json:"token"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}

const (
	QueueTaskName  = "notif.data.queue"
	QueueErrorName = "notif.error.queue"
)
