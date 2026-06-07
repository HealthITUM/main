export var AppQueue;
(function (AppQueue) {
    AppQueue["ScrapperResult"] = "scrapper.result.queue";
    AppQueue["PlantDetectionResult"] = "pdet.result.queue";
    AppQueue["SensorData"] = "sensor.data.queue";
})(AppQueue || (AppQueue = {}));
export var RoutingKey;
(function (RoutingKey) {
    RoutingKey["ScrapperTask"] = "scrapper.task.start";
    RoutingKey["PlantDetectionTasks"] = "pdet.task.important";
    RoutingKey["NotificationData"] = "notif.data.send";
})(RoutingKey || (RoutingKey = {}));
