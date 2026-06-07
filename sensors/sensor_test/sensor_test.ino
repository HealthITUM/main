#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>

#define I2C_SDA 4
#define I2C_SCL 5
#define ANALOG_PIN 6
#define RGB_LED_PIN 48

Adafruit_BME280 bme;
BH1750 lightMeter;

bool running = false;

void setup() {
  Serial.begin(115200);
  Wire.begin(I2C_SDA, I2C_SCL);

  neopixelWrite(RGB_LED_PIN, 0, 0, 0);
  
  bme.begin(0x76);
  lightMeter.begin();
  analogReadResolution(12);
  pinMode(ANALOG_PIN, INPUT);

  Serial.println("--- System Ready ---");
  Serial.println("Send 's' to START logging");
  Serial.println("Send 'x' to STOP logging");
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    
    if (command == 's') {
      running = true;
      Serial.println(">>> STARTING SENSORS");
    } 
    else if (command == 'x') {
      running = false;
      Serial.println(">>> STOPPING SENSORS (Idle)");
    }
  }

  if (running) {
    readSensors();
    delay(1000); 
  }
}

void readSensors() {
  int moisturePercent = map(analogRead(ANALOG_PIN), 1300, 2167, 100, 0);
  moisturePercent = constrain(moisturePercent, 0, 100);
  
  float pressureBars = bme.readPressure() / 100000.0F;

  float temp = bme.readTemperature();
  if (isnan(temp) || temp < -40.0) { 
    Serial.println("!!! BME280 Error - Attempting Reset...");
    Wire.begin(6, 7);
    bme.begin(0x76);
    return;
  }

  Serial.print("T: "); Serial.print(temp);
  Serial.print(" | L: "); Serial.print(lightMeter.readLightLevel());
  Serial.print(" | P: "); Serial.print(pressureBars, 4);
  Serial.print(" | H: "); Serial.print(bme.readHumidity(), 4);
  Serial.print(" | S: "); Serial.println(moisturePercent);
}


