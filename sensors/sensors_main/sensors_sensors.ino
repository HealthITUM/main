void setupSensors(){
  Wire.begin(I2C_SDA, I2C_SCL);
  bme.begin(0x76);
  lightMeter.begin();
  analogReadResolution(12);
  pinMode(ANALOG_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}
void sensorsLoop(){

}

bool isButtonPressed() {
  return digitalRead(BUTTON_PIN) == LOW;
}

sensorReading readSensors() {
  float moisture = map(analogRead(ANALOG_PIN), 1300, 2167, 100, 0);
  moisture = constrain(moisture, 0, 100);

  float temp = bme.readTemperature();
  float light = lightMeter.readLightLevel();

  sensorReading reading;

  reading.moisture = moisture;
  reading.temperature = bme.readTemperature();
  reading.light = lightMeter.readLightLevel();
  
  Serial.println("Sensors read");

  return reading;
}