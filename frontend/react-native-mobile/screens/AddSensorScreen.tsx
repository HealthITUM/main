import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userPlantService, useAuth } from "@project/frontend-shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
import type { ISensorCreateResponseDTO, IUserPlantDTO } from "@project/shared";
import { IESPSendingModel } from "../models/SensorModel";
import { Buffer } from "buffer";
//plant api service

const userPlant = userPlantService(api);

const SERVICE_UUID = "02e11775-d980-4650-a38f-88cf21207cde";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

// export const usePlantSensor = () => {
// const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
// const [errors, setErrors] = useState<string[]>([]);
// const [loading, setLoading] = useState(false);

// 1. ШАГ: Ищем и подключаемся к ESP32
//   const connectToESP32 = () => {
//     setLoading(true);

//     manager.startDeviceScan(null, null, async (error, device) => {
//       if (error) {
//         setErrors([error.message]);
//         setLoading(false);
//         return;
//       }

//       if (device && device.name === "PlantITSensor") {
//         manager.stopDeviceScan();

//         try {
//           const connected = await device.connect();
//           const discoveredDevice =
//             await connected.discoverAllServicesAndCharacteristics();

//           setConnectedDevice(discoveredDevice);
//           setLoading(false);
//         } catch (err) {
//           setErrors(["Unable to connect to ESP!"]);
//           setLoading(false);
//         }
//       }
//     });
//   };

//   const sendDataToESP32 = async (sensorData: ISensorCreateResponseDTO) => {
//     if (!connectedDevice) {
//       throw new Error("ESP32 is not connected via Bluetooth!");
//     }
//     const test_wifi_id = "Pixel";
//     const test_wifi_pass = "";
//     const payload: IESPSendingModel = {
//       wifi_id: test_wifi_id,
//       wifi_pass: test_wifi_pass,
//       upid: sensorData.userPlantId,
//       mqtt_url: sensorData.mosquitto_url,
//       mqtt_us: sensorData.mosquitto_user,
//       mqtt_pass: sensorData.mosquitto_password,
//       mqtt_port: sensorData.mosquitto_port,
//     };

//     const jsonString = JSON.stringify(payload);
//     const base64Data = Buffer.from(jsonString).toString("base64");

//     await connectedDevice.writeCharacteristicWithResponseForService(
//       SERVICE_UUID,
//       CHARACTERISTIC_UUID,
//       base64Data,
//     );
//   };

//   return { connectToESP32, sendDataToESP32, connectedDevice };
// };

export const AddSensorScreen = ({ navigation, route }: any) => {
  //plant id from route params from previous screen
  //used for: POST /my/plants/:id/sensors
  const { plantId } = route.params;
  //gets jwt token from authcontext - protects screen and api requests
  const { token } = useAuth();

  // const { connectToESP32, sendDataToESP32, connectedDevice } = usePlantSensor();

  //real plant info
  const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
  //demo plant
  /*const [plant] = useState({
        id: 1,
        name: "Demo Plant",
        imageUrl: "",
        plantSpecieId: 1,
    });*/
  //loading states
  const [loading, setLoading] = useState(false);
  //errors - validation, api errors
  const [errors, setErrors] = useState<string[]>([]);

  //remove for backend - fetches real plant data

  useEffect(() => {
    const loadPlant = async () => {
      try {
        //starts loading
        setLoading(true);
        //backend: GET /my/plants/:id
        const data = await userPlant.getById(plantId);
        //stores data
        setPlant(data);
      } catch {
        setErrors(["Failed to load plant"]);
      }finally {
        setLoading(false);
      }
    };
    loadPlant();
  }, [plantId]); //runs if plant id is changed

  //remove for backend - is user logged in?

  useEffect(() => {
    if (!token) {
      navigation.replace("Login");
    }
  }, [token, navigation]); //runs if token or navigation is changed

  //when user presses add sensor
  // const handleCreateSensor = async () => {
  //   if (!token) {
  //     navigation.replace("Login");
  //     return;
  //   }
  //   if (!connectedDevice) {
  //     setErrors(["Сначала подключитесь к ESP32 по Bluetooth!"]);
  //     return;
  //   }

  //   setErrors([]);
  //   setLoading(true);

  //   try {
  //     // 1. Стучимся на бэкенд
  //     const sensorData = await userPlant.addSensor(plantId);

  //     if (sensorData === null) {
  //       setErrors(["Failed to add sensor"]);
  //       return;
  //     }

  //     // 2. Передаем полученные данные в метод нашего хука для отправки на ESP32
  //     await sendDataToESP32(sensorData);

  //     // 3. Уходим назад, если всё успешно
  //     navigation.goBack();
  //   } catch (error: any) {
  //     setErrors([
  //       error.message || "Failed to add sensor or send data to ESP32",
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //if plant info is not loaded yet

  const handleCreateSensor = async () => {
    if(!token) {
      navigation.replace("Login");
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const response = await userPlant.addSensor(plantId);
      navigation.goBack();
    } catch (error: any) {
      setErrors([
        error.message || "Failed to add sensor",
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!plant) {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Text style={{ color: "white" }}>Loading plant...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.appContainer}>
      <SafeAreaView style={styles.appContainer}>
        <View
          style={[
            styles.darkGreenNavbar,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 999,
              elevation: 10,
              paddingHorizontal: 12,
            },
          ]}
        >
          <Text style={[styles.title, { color: "white" }]}>PlantIT</Text>

          <TouchableOpacity
            style={styles.darkGreenButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.darkGreenButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View
            style={[
              styles.darkGreenCard,
              {
                maxWidth: 800,
                alignSelf: "center",
                width: "100%",
                padding: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  textAlign: "center",
                  marginBottom: 15,
                  fontWeight: "600",
                },
              ]}
            >
              Add Sensor
            </Text>

            {errors.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                {errors.map((e, i) => (
                  <Text key={i} style={{ color: "#ff6b6b" }}>
                    {e}
                  </Text>
                ))}
              </View>
            )}

            <Text
              style={{
                color: "white",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "800" }}>Plant:</Text> {plant.name}
            </Text>

            {/* --- СЕКЦИЯ BLUETOOTH ПОДКЛЮЧЕНИЯ --- */}
            {/* <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
              }}
            >
              <Text style={{ color: "white", marginBottom: 8 }}>
                Статус Bluetooth:{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: connectedDevice ? "#4cd137" : "#eccc68",
                  }}
                >
                  {connectedDevice ? "Подключен к ESP32" : "Не подключен"}
                </Text>
              </Text>

              {!connectedDevice && (
                <TouchableOpacity
                  style={[
                    styles.darkGreenButton,
                    { backgroundColor: "#2ed573" },
                  ]}
                  onPress={connectToESP32}
                >
                  <Text style={styles.darkGreenButtonText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View> */}
            <TouchableOpacity
              style={styles.darkGreenButton}
              onPress={handleCreateSensor}
              disabled={loading}
            >
              <Text style={styles.darkGreenButtonText}>
                {loading ? "Adding sensor..." : "Add Sensor"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
