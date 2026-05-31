export enum AppQueue { // gets
  ScrapperResult = 'scrapper.result.queue',
  PlantDetectionResult = 'pdet.result.queue',
  SensorData = 'sensor.data.queue',
  NotificationErrors = 'notif.error.queue'
}

export enum RoutingKey { // sends
  ScrapperTask = 'scrapper.task.start',
  PlantDetectionTasks = 'pdet.task.important',
  NotificationData = 'notif.data.send'
}