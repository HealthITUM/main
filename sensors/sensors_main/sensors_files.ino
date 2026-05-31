const unsigned char aes_key[16] = { 230, 84, 58, 252, 247, 233, 98, 95, 26, 175, 179, 221, 97, 32, 104, 190 };
unsigned char aes_iv[16]  = { 78, 231, 207, 249, 14, 154, 179, 61, 38, 46, 166, 246, 124, 183, 81, 59 };

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
  doc["ssid"] = encryptData(wifiSSID);
  doc["password"] = encryptData(wifiPassword);
  doc["plantId"] = plantId;
  doc["mosquittoAddr"] = encryptData(mosquittoAddr);
  doc["mqttUser"] = encryptData(mqttUser);
  doc["mqttPass"] = encryptData(mqttPass);
  doc["mqttPort"] = encryptData(mqttPort);

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

  wifiSSID = decryptData(doc["ssid"].as<String>());
  wifiPassword = decryptData(doc["password"].as<String>());
  plantId = doc["plantId"].as<String>();
  mosquittoAddr = decryptData(doc["mosquittoAddr"].as<String>());
  mqttUser = decryptData(doc["mqttUser"].as<String>());
  mqttPass = decryptData(doc["mqttPass"].as<String>());
  mqttPort = decryptData(doc["mqttPort"].as<String>());

  clientId = clientIdPrefix + plantId;
  publishPath = publishPathPrefix + clientId;
  statusPath = statusPathPrefix + clientId;

  Serial.println("Successfully loaded credentials from Flash!");
  return true;
}

String padString(String str) {
  int padLen = 16 - (str.length() % 16);
  for (int i = 0; i < padLen; i++) {
    str += (char)padLen;
  }
  return str;
}

String unpadString(String str) {
  int len = str.length();
  if (len == 0) return "";
  int padLen = (int)str[len - 1];
  if (padLen > 0 && padLen <= 16) {
    return str.substring(0, len - padLen);
  }
  return str;
}

String encryptData(String plainText) {
  String padded = padString(plainText);
  int outLen = padded.length();
  char encrypted[outLen + 1];
  
  unsigned char iv_copy[16];
  memcpy(iv_copy, aes_iv, 16);

  mbedtls_aes_context aes;
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_enc(&aes, aes_key, 128);
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_ENCRYPT, outLen, iv_copy, (const unsigned char*)padded.c_str(), (unsigned char*)encrypted);
  mbedtls_aes_free(&aes);

  String hexResult = "";
  for (int i = 0; i < outLen; i++) {
    if ((unsigned char)encrypted[i] < 16) hexResult += "0";
    hexResult += String((unsigned char)encrypted[i], HEX);
  }
  return hexResult;
}

String decryptData(String hexText) {
  int len = hexText.length() / 2;
  char encrypted[len];
  for (int i = 0; i < len; i++) {
    encrypted[i] = (char)strtol(hexText.substring(i*2, i*2+2).c_str(), NULL, 16);
  }

  char decrypted[len + 1];
  unsigned char iv_copy[16];
  memcpy(iv_copy, aes_iv, 16);

  mbedtls_aes_context aes;
  mbedtls_aes_init(&aes);
  mbedtls_aes_setkey_dec(&aes, aes_key, 128);
  mbedtls_aes_crypt_cbc(&aes, MBEDTLS_AES_DECRYPT, len, iv_copy, (const unsigned char*)encrypted, (unsigned char*)decrypted);
  decrypted[len] = '\0';
  mbedtls_aes_free(&aes);

  return unpadString(String(decrypted));
}




























