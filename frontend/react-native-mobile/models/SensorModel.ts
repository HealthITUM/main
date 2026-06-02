export interface IESPSendingModel { // transfering data from react-native to esp32
    wifi_id : string;
    wifi_pass : string;
    upid : number;
    mqtt_us : string;
    mqtt_pass : string;
    mqtt_url : string;
    mqtt_port : string;
}