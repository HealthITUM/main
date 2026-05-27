void wifiLoop(){

}

void onWiFiDisconnect(WiFiEvent_t event, WiFiEventInfo_t info) {
  if (!isWifiActive) return;
  stopWifi();
  Serial.println("Wifi disconnected");
}

void startWifi() {
  if (isWifiActive) return;

  Serial.println("Starting wifi");

  WiFi.mode(WIFI_STA);
  WiFi.onEvent(onWiFiDisconnect, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.begin(wifiSSID.c_str(), wifiPassword.c_str());

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Wifi connected");
    concealBluetooth();
    startMqtt();
    isWifiActive = true;
  } else {
    isWifiActive = false;
  }
}

void stopWifi() {
  if (!isWifiActive) return;
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  isWifiActive = false;
  Serial.println("Wifi stopped");
}