class WiFiCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    Serial.println("Bluetooth write");
    String value = pCharacteristic->getValue();

    if (value.length() > 0) {
      Serial.println("Received BLE data:");

      int firstComma = value.indexOf(',');
      int secondComma = value.indexOf(',', firstComma + 1);
      int thirdComma = value.indexOf(',', secondComma + 1);

      if (firstComma == -1 || secondComma == -1 || thirdComma == -1) return;

      wifiSSID = value.substring(0, firstComma);
      wifiPassword = value.substring(firstComma + 1, secondComma);
      plantId = value.substring(secondComma + 1, thirdComma);
      mosquittoAddr = value.substring(thirdComma + 1);

      saveCredentials();

      startWifi();
    }
  }
};

void setupBluetooth() {  
  if (isBleActive) {
    return;
  }

  BLEDevice::init("PlantITSensor");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pCharacteristic->setCallbacks(new WiFiCallback());
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  //pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  Serial.println("Bluetooth set up");
}

void bluetoothLoop(){
  if (isBleActive && (millis() - bleStartTime >= 30000)) {
    concealBluetooth();
  }
}

void advertiseBluetooth() {
  if (isBleActive) return;

  BLEDevice::startAdvertising();
  bleStartTime = millis();
  isBleActive = true;

  Serial.println("Bluetooth advertising");
}

void concealBluetooth() {
  if (!isBleActive) return;

  isBleActive = false;
  if (BLEDevice::getAdvertising()) {
    BLEDevice::getAdvertising()->stop();
  }

  Serial.println("Bluetooth concealed");
}