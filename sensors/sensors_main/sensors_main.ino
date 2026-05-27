#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>
#include <ArduinoJson.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include "FS.h"
#include "LittleFS.h"

// ------------ SENSORS ----------

struct sensorReading {
  const char* plantId;
  float light;
  float moisture;
  float humidity;
  float temperature;

  String toString() {
    JsonDocument doc;

    doc["plantId"] = plantId;
    doc["light"] = light;
    doc["moisture"] = moisture;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
  
    String jsonPayload;
    serializeJson(doc, jsonPayload);

    return jsonPayload;
  }
};

#define I2C_SDA 4
#define I2C_SCL 5
#define ANALOG_PIN 6
#define RGB_LED_PIN 48

Adafruit_BME280 bme;
BH1750 lightMeter;

// ----------- BLE ---------------
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEService* pService = NULL;
BLEAdvertising* pAdvertising = NULL;
unsigned long bleStartTime = 0;
bool isBleActive = false;

#define SERVICE_UUID "81ae7b08-8a64-433d-abcb-900eb77962df"
#define CHARACTERISTIC_UUID "2c512430-b930-4cbe-8aea-05ce5cb0104b"

// -------- MQTT & WIFI -----------
bool isWifiActive = false;
String plantId = "";
String wifiSSID = "";
String wifiPassword = "";
String mosquittoAddr = "";
String clientIdprefix = "Plant_";
String publishPath = "home/plants/sensors";
unsigned long msgTime = 10000;
unsigned long lastMqttRetry = 0;
const unsigned long mqttRetryInterval = 5000;

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

// ----------- FS ----------------

bool isFsActive = false;

// ----------- REST --------------

void handleStatusLed() {
  if (client.connected()){
    neopixelWrite(RGB_LED_PIN, 0, 1, 0);
    return;
  }
  if (isWifiActive) {
    neopixelWrite(RGB_LED_PIN, 1, 0, 1);
    return;
  }
  if (isBleActive) {
    neopixelWrite(RGB_LED_PIN, 0, 0, 1);
    return;
  }
  neopixelWrite(RGB_LED_PIN, 1, 0, 0);
  
}

void resetButtonPressed() {
  stopWifi();
  advertiseBluetooth();
}

void setup() {
  neopixelWrite(RGB_LED_PIN, 1, 0, 0);
  plantId.reserve(10);
  wifiSSID.reserve(50);
  wifiPassword.reserve(50);
  mosquittoAddr.reserve(100);
  publishPath.reserve(100);
  clientIdprefix.reserve(25);


  Serial.begin(115200);
  delay(1000);

  setupFilesys();
  setupSensors();
  setupBluetooth();

  if(loadCredentials()){
    startWifi();
  }
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    if (command == 'p') {
      resetButtonPressed();
    }
  }

  bluetoothLoop();
  mqttLoop();  

  handleStatusLed();
}


