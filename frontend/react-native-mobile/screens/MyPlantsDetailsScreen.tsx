import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { IUserPlantDTO, ISensorDTO, IMeasurementDTO } from "@project/shared";
import { userPlantService, useAuth } from "@project/frontend-shared";
import { styles } from "../src/styles";
import { api } from "../src/api";

export const MyPlantDetailsScreen = ({ navigation }: any) => {
    //gets plant id from navigation
    const route = useRoute<any>();
    const { id } = route.params;
    //gets jwt token from authContext
    const { token } = useAuth();
    //creates api service instance 
    const userPlant = userPlantService(api);
    //current plant
    const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
    //sensors list
    const [sensors, setSensors] = useState<ISensorDTO[]>([]);
    const [measurements, setMeasurements] = useState<IMeasurementDTO[]>([]);
    //loading state
    const [loading, setLoading] = useState(true);
    //validation and api errors
    const [error, setError] = useState<string | null>(null);
    
    //add for backend - is user logged in?
    useEffect(() => {
        if (!token) {
            navigation.replace("Login");
        }
    }, [token, navigation]); //runs if token or navigation changes

    useEffect(() => {
        const load = async () => {
            try {
                //checks if there is plant id - not - it stops loading
                if (!id) return;
                //shows loading state
                setLoading(true);
                //backend: GET /user-plant/:id
                const plantData = await userPlant.getById(String(id));
                console.log("PLANT DATA:", plantData);
                console.log("IMAGE URL:", plantData.imageUrl);
                //stores plant in state
                setPlant(plantData);
                //gets sensors from backend
                const sensorData = await userPlant.getSensors(String(id));
                //stores sensors
                setSensors(sensorData);
                //gets measurements from backend
                const measurementData = await userPlant.getMeasurements(String(id));
                //stores measurements
                setMeasurements(measurementData);
                //removes previous errors
                setError(null);
            } catch (e) {
                setError("Failed to load plant details");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]); //reloads data if plant id changes


    //fake data for plant and sensors
    /*useEffect(() => {
        const demoPlant: IUserPlantDTO = {
            id: 123,
            name: "Monstera Deliciosa",
            imageUrl:
                "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200",
            plantSpecieId: 1,
        };

        const demoSensors: ISensorDTO[] = [
            {
                id: 1,
                userPlantId: 123,
                online: true,
                last_seen: new Date(),
            },
            {
                id: 2,
                userPlantId: 123,
                online: false,
                last_seen: new Date(),
            },
        ];
        //stores fake data into state
        setPlant(demoPlant);
        setSensors(demoSensors);
        setLoading(false);
    }, []);*/

    const handleDeleteSensor = async (sensorId: number) => {
        try {
            //backend: DELETE /user-plant/:id/sensor/:sensorId
            await userPlant.deleteSensor(String(id), String(sensorId));
            //removes deleted sensor from UI
            setSensors((prev) =>
                prev.filter((s) => s.id !== sensorId)
            );
        } catch {
            setError("Failed to delete sensor");
        }
    };
    //temporary for frontend - only delete
    /*const handleDeleteSensor = (sensorId: number) => {
        setSensors((prev) => prev.filter((s) => s.id !== sensorId));
    };*/
    //navigation to add sensor screen
    const handleAddSensor = () => {
        navigation.navigate("AddSensor", { plantId: id });
    };
    //shows loading UI before it gets data
    if (loading) {
        return (
            <SafeAreaView style={styles.appContainer}>
                <Text style={styles.baseText}>Loading...</Text>
            </SafeAreaView>
        );
    }
    //if plant failed to load
    if (!plant) {
        return (
            <SafeAreaView style={styles.appContainer}>
                <Text style={styles.baseText}>Plant not found</Text>
            </SafeAreaView>
        );
    }

    const fixedImageUrl = plant.imageUrl.replace(
        process.env.EXPO_PUBLIC_STORAGE_URL_LOCAL!,
        process.env.EXPO_PUBLIC_STORAGE_URL!
    );

   return (
        <SafeAreaView style={styles.appContainer}>

            <View
                style={[
                    styles.darkGreenNavbar,
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 12,
                    },
                ]}
            >
                <Text style={[styles.title, { color: "white" }]}>
                    PlantIT
                </Text>

                <TouchableOpacity
                    style={styles.darkGreenButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.darkGreenButtonText}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>

                {plant.imageUrl && (
                    <Image
                        source={{ uri: fixedImageUrl }}
                        style={{
                            width: "100%",
                            height: 220,
                            borderRadius: 12,
                            marginBottom: 15,
                        }}
                    />
                )}

                <View style={styles.darkGreenCard}>
                    <Text style={[styles.title, { marginBottom: 10, fontSize: 30 }]}>
                        {plant.name}
                    </Text>

                    <Text
                        style={{
                            color: "#9fbf9f",
                            fontSize: 15,
                            marginBottom: 4,
                            fontWeight: "700",
                        }}
                    >
                        SPECIES ID
                    </Text>

                    <Text style={[styles.baseText, { fontSize: 15 }]}>
                        {plant.plantSpecieId}
                    </Text>

                    <Text
                        style={{
                            color: "#9fbf9f",
                            fontSize: 15,
                            marginTop: 10,
                            marginBottom: 4,
                            fontWeight: "700",
                        }}
                    >
                        PLANT ID
                    </Text>

                    <Text style={[styles.baseText, { fontSize: 15 }]}>
                        {plant.id}
                    </Text>

                    <TouchableOpacity
                        style={[styles.darkGreenButton, { marginTop: 15 }]}
                        onPress={() =>
                            navigation.navigate("EditPlant", { id: plant.id })
                        }
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Edit plant
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.darkGreenCard, { marginTop: 15 }]}>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 15,
                        }}
                    >
                        <Text style={[styles.darkGreenCardTitle, { fontSize: 20 }]}>
                            Sensors
                        </Text>

                        <TouchableOpacity
                            style={styles.darkGreenButton}
                            onPress={handleAddSensor}
                        >
                            <Text style={styles.darkGreenButtonText}>
                                + Add Sensor
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {sensors.length === 0 ? (
                        <Text style={styles.baseText}>
                            No sensors connected
                        </Text>
                    ) : (
                        sensors.map((sensor) => (
                            <View
                                key={sensor.id}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#2f4f2f",
                                    padding: 10,
                                    borderRadius: 8,
                                    marginBottom: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#9fbf9f",
                                        fontSize: 15,
                                        marginBottom: 4,
                                        fontWeight: "700",
                                    }}
                                >
                                    PLANT ID
                                </Text>

                                <Text style={styles.baseText}>
                                    {sensor.userPlantId}
                                </Text>

                                <Text
                                    style={{
                                        color: "#9fbf9f",
                                        fontSize: 15,
                                        marginTop: 10,
                                        marginBottom: 4,
                                        fontWeight: "700",
                                    }}
                                >
                                    STATUS
                                </Text>

                                <Text style={styles.baseText}>
                                    {sensor.online ? "Online" : "Offline"}
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.darkGreenButton,
                                        {
                                            marginTop: 10,
                                            backgroundColor: "#7A2E2E",
                                        },
                                    ]}
                                    onPress={() => handleDeleteSensor(sensor.id)}
                                >
                                    <Text style={styles.darkGreenButtonText}>
                                        Delete sensor
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
                <View style={[styles.darkGreenCard, { marginTop: 15 }]}>
                    <Text style={[styles.darkGreenCardTitle, { fontSize: 20, marginBottom: 10 }]}>
                        Measurements
                    </Text>

                    {measurements.length === 0 ? (
                        <Text style={styles.baseText}>No measurements available</Text>
                    ) : (
                        measurements.map((m) => (
                            <View
                                key={m.id}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#2f4f2f",
                                    padding: 10,
                                    borderRadius: 8,
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={{ color: "#9fbf9f", fontWeight: "700" }}>
                                    TIME
                                </Text>

                                <Text style={styles.baseText}>
                                    {new Date(m.timestamp).toLocaleString()}
                                </Text>

                                <Text style={{ color: "#9fbf9f", fontWeight: "700", marginTop: 8 }}>
                                    VALUES
                                </Text>

                                <Text style={styles.baseText}>
                                    {JSON.stringify(m.values, null, 2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};