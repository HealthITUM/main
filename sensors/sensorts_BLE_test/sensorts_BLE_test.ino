#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <WiFi.h>

struct sensorReading {
  float light;
  float moisture;
  float humidity;
  float temperature;
};

void startWifi();
sensorReading readSensors();
void handleStatusLED();

// ------------ SENSORS ----------
#define I2C_SDA 4
#define I2C_SCL 5
#define ANALOG_PIN 6
#define RGB_LED_PIN 48

Adafruit_BME280 bme;
BH1750 lightMeter;

// // ----------- BLE ---------------
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLEService *pService = NULL;
BLEAdvertising *pAdvertising = NULL;
unsigned long bleStartTime = 0;
bool isBleActive = false;
bool isWifiActive = false;

String wifiSSID = "";
String wifiPassword = "";

#define SERVICE_UUID        "81ae7b08-8a64-433d-abcb-900eb77962df"
#define CHARACTERISTIC_UUID "2c512430-b930-4cbe-8aea-05ce5cb0104b"

class WiFiCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    String value = pCharacteristic->getValue();

    if (value.length() > 0) {
      Serial.println("Received BLE data:");

      int commaIndex = value.indexOf(',');

      if (commaIndex > 0) {
        wifiSSID = value.substring(0, commaIndex);
        wifiPassword = value.substring(commaIndex + 1);

        Serial.print("SSID: ");
        Serial.println(wifiSSID);

        Serial.print("Password: ");
        Serial.println(wifiPassword);

        startWifi();
      }
    }
  }
};

void startBluetooth(){
  if (isBleActive) {
    Serial.println("Bluetooth is already running!");
    return;
  }

  Serial.println("starting bluetooth server!");
  BLEDevice::init("PlantITSensor");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pCharacteristic->setCallbacks(new WiFiCallback());
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  //pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  Serial.println("Bluetooth server started!");
  bleStartTime = millis();

}

void advertiseBluetooth(){
  if (isBleActive) return;

  BLEDevice::startAdvertising();
  Serial.println("Advertising bluetooth!");
  isBleActive = true;
  handleStatusLED();
}

void stopBluetooth() {
  if (!isBleActive) return;

  isBleActive = false;
  Serial.println("Deadvertising bluetooth!");
  if (BLEDevice::getAdvertising()) {
    BLEDevice::getAdvertising()->stop();
  }

  // BLEDevice::deinit(true);
  // pServer = NULL;
  // pService = NULL;
  // pCharacteristic = NULL;
  // pAdvertising = NULL;

  handleStatusLED();
}

void onWiFiDisconnect(WiFiEvent_t event, WiFiEventInfo_t info) {
  if (!isWifiActive) return;
  Serial.println("WiFi disconnected");
  stopWifi();
  isWifiActive = false;
}

void startWifi() {
  if (isWifiActive) return;

  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.onEvent(onWiFiDisconnect, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.begin(wifiSSID.c_str(), wifiPassword.c_str());

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.println(WiFi.localIP());
    isWifiActive = true;
    stopBluetooth();

  } else {
    Serial.println("\nWiFi failed.");
    isWifiActive = false;
  }
  handleStatusLED();
}

void stopWifi(){
  if (!isWifiActive) return;
  neopixelWrite(RGB_LED_PIN, 1, 0, 0);
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  isWifiActive = false;
  handleStatusLED();
}

void handleStatusLED(){
  if (isBleActive) {
    neopixelWrite(RGB_LED_PIN, 0, 0, 1);
    return;
  }
  if (isWifiActive) {
    neopixelWrite(RGB_LED_PIN, 0, 1, 0);
    return;
  }
  neopixelWrite(RGB_LED_PIN, 1, 0, 0);
}

void resetButtonPressed(){
  stopWifi();
  advertiseBluetooth();
}

void setup() {
  Serial.begin(115200);
  Wire.begin(I2C_SDA, I2C_SCL);
  startBluetooth();

  handleStatusLED();
  
  bme.begin(0x76);
  lightMeter.begin();
  analogReadResolution(12);
  pinMode(ANALOG_PIN, INPUT);
  Serial.print("ESP ready");
}

void loop() {
  handleStatusLED();
  if (Serial.available() > 0) {
    char command = Serial.read();
    
    if (command == 'p') {
      resetButtonPressed();
    } 
  }

  if (isBleActive && (millis() - bleStartTime >= 60000)) {
    stopBluetooth();
  }

  sensorReading test = readSensors();
}

sensorReading readSensors() {
  float moisture = map(analogRead(ANALOG_PIN), 1300, 2167, 100, 0);
  moisture = constrain(moisture, 0, 100);

  float temp = bme.readTemperature();
  float humidity = bme.readHumidity();
  float light = lightMeter.readLightLevel();

  sensorReading reading;

  reading.moisture = moisture;
  reading.temperature = bme.readTemperature();
  reading.humidity = bme.readHumidity();
  reading.light = lightMeter.readLightLevel();

  return reading;
}




