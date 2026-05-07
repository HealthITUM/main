# Mosquitto MQTT.
## 1. Basics.
### 1.1 What is MQTT?
MQTT- Protocol for message-brokers, that allows us to easily communicate between devices that has bad connection. In this project, we use **Mosquitto**.
### 1.2 Mosquitto.
MQTT-broker. Allows us to easily communicate between **ESP32-C6** and our microservice on **Golang**. Parameter ```retain``` allows us to load the history if Mosquitto was shut down. We keep ```True``` for status and ```False``` for data.
### 1.3 Data model.
**ESP32-C6** must send data in this particular way:
```
{
    "v" : "1", # version of our interface channel. Used for the situation, where we can add new sensors and send more data.
    "data" : # object, that includes everything from our sensors.
    {
        "moisture" : "<num>",
        "temp" : "<num>",
        "light" : "<num>"
    }
}
```
### 1.4 Status model.
We use status in order to control on the situation of our sensors. There are 2 types of statuses: ```"status" : "online"``` and ```"status" : "offline"```. On start, **ESP32-C6** sends message with ```"status" : "online"``` and after that starting to sending data. On the other hand, offline-status message must contain reason and is send with status. Example:
```
{
    "status" : "offline",
    "reason" : "manual stop/unexpected"
}
```
#### 1.4.1 KeepAlive
Automatic system, that helps us to control the state of sensor. We can set it to any amount of time (ex. 60 second) and if in this time period there will be no message, MQTT will automaticly send status-message (Last Will)/
#### 1.4.2 Last Will
Type of message that will be automaticly send my MQTT, if **KeepAlive** will say.
```
{
    "status" : "offline",
    "reason" : "unexpected"
}
```
### 1.5 Routes.
In order to easily follow, which of the sensors is sending what, we use routing:
```
v1/sensors/{CHIP_ID}/{data/status}
```
That allows us not only to clearly see, which of the sensors is working, but also contain status of the sensor in the same place with data.
### 1.6 Structure of broker.
```
v1/
    sensors/
        {CHIP_ID}/
            data/
                {data}
            status/
                {status}
```
### 1.7 Full architecture.
![Architecture](./ESP-MQTT_Diagram/Microservices_ESP-MQTT.drawio.svg)
## 2. Mosquitto Docker Image.
### 2.1 Install.
```
docker run -d \
  --name mosquitto \
  -p 1883:1883 \
  -p 9001:9001 \
  -v "$(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf" \
  eclipse-mosquitto
```
### 2.2 Start.
```docker start mosquitto```
### 2.3 Stop.
```docker stop mosquitto```
### 2.4 How to check incoming data in Mosquitto?
**MQTT EXPLORER**
#### GitHub:
```https://github.com/thomasnordquist/MQTT-Explorer/releases/tag/v0.3.5```  
#### Host : 
localhost
#### Port : 
1883
### 2.5 Docker-image configuration.
All config is located in ```mosquitto.conf```. Explanation:
```
listener 1883 - port
allow_anonymous true - allows to connect to MQTT from any point.
```
### 2.6 How to send data to broker (Python-Sim)?
In this repo:
#### Mac:
```cd esp32-sim && source venv/bin/activate && python3 esp-sim.py```

## 3. ENV and Deployment.
We should add ```MOSQUITTO_URL``` in our .env file.