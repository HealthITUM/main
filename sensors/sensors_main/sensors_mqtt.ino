void mqttLoop(){
  if (isWifiActive) {
    if (!client.connected()) {
      mqttReconnect();
    }
    client.loop();

    unsigned long now = millis();
    if (now - lastMsg > msgTime && client.connected()) {
      lastMsg = now;
      sensorReading readings = readSensors();

      Serial.print("Publishing message: ");
      Serial.println(readings.toString().c_str());
      client.publish(publishPath.c_str(), readings.toString().c_str());
    }
  }
}

void startMqtt(){
  client.setServer(mosquittoAddr.c_str(), 1883);
  Serial.println("Attempting to connect to MQTT");
}

void mqttReconnect() {
  if (isBleActive) return;

  if (client.connected()) {
    return;
  }

  unsigned long now = millis();
  
  if (now - lastMqttRetry > mqttRetryInterval) {
    lastMqttRetry = now;
    
    Serial.print("Attempting MQTT connection... ");
    
    String clientId = clientIdprefix + plantId;
    Serial.print("Client Id: "); Serial.println(clientId);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("[CONNECTED]");
    } else {
      Serial.print("[FAILED] rc=");
      Serial.println(client.state());
      Serial.println("Will retry in 5 seconds. Moving on...");
    }
  }
}