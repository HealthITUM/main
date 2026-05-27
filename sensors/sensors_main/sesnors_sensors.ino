void setupSensors(){
  Wire.begin(I2C_SDA, I2C_SCL);
  bme.begin(0x76);
  lightMeter.begin();
  analogReadResolution(12);
  pinMode(ANALOG_PIN, INPUT);
}
void sensorsLoop(){

}

sensorReading readSensors() {
  float moisture = map(analogRead(ANALOG_PIN), 1300, 2167, 100, 0);
  moisture = constrain(moisture, 0, 100);

  float temp = bme.readTemperature();
  float humidity = bme.readHumidity();
  float light = lightMeter.readLightLevel();

  sensorReading reading;

  reading.plantId = plantId.c_str();
  reading.moisture = moisture;
  reading.temperature = bme.readTemperature();
  reading.humidity = bme.readHumidity();
  reading.light = lightMeter.readLightLevel();
  
  Serial.println("Sensors read");

  return reading;
}