void setupFilesys(){
  if (!LittleFS.begin(false)) { 
    Serial.println("Mount failed. Formatting flash storage layout");
    LittleFS.begin(true); 
  }

  int retryCount = 0;
  while (!LittleFS.begin(false)) {
    retryCount++;
    Serial.print("Waiting for storage drive... Retry #");
    Serial.println(retryCount);
    
    delay(2000); 

    if (retryCount > 5) {
      Serial.println("CRITICAL: Hardware flash error. Cannot boot.");
      while (true) { delay(1000); }
    }
  }
}

void filesysLoop(){

}

void saveCredentials() {
  File file = LittleFS.open("/config.json", "w");
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }

  JsonDocument doc;
  doc["ssid"] = wifiSSID;
  doc["password"] = wifiPassword;
  doc["plantId"] = plantId;
  doc["mosquittoAddr"] = mosquittoAddr;

  if (serializeJson(doc, file) == 0) {
    Serial.println("Failed to write data to file");
  } else {
    Serial.println("Configuration saved to Flash memory!");
  }
  file.close();
}

bool loadCredentials() {
  if (!LittleFS.exists("/config.json")) {
    Serial.println("No saved configuration found in Flash.");
    return false;
  }

  File file = LittleFS.open("/config.json", "r");
  if (!file) {
    Serial.println("Failed to open configuration file");
    return false;
  }

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, file);
  file.close();

  if (error) {
    Serial.println("Failed to parse configuration file JSON");
    return false;
  }

  wifiSSID = doc["ssid"].as<String>();
  wifiPassword = doc["password"].as<String>();
  plantId = doc["plantId"].as<String>();
  mosquittoAddr = doc["mosquittoAddr"].as<String>();

  Serial.println("Successfully loaded credentials from Flash!");
  return true;
}