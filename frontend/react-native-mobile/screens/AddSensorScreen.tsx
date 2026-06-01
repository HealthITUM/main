import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userPlantService, useAuth } from "@project/frontend-shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
import type { IUserPlantDTO } from "@project/shared";
//plant api service
const userPlant = userPlantService(api);

export const AddSensorScreen = ({ navigation, route }: any) => {

    //plant id from route params from previous screen
    //used for: POST /my/plants/:id/sensors
    const { plantId } = route.params;
    //gets jwt token from authcontext - protects screen and api requests
    const { token } = useAuth();
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
    //sensor name
    const [sensorName, setSensorName] = useState("");

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
    
    //validation
    const validate = () => {
        //stores validation errors
        const err: string[] = [];
        if (!sensorName.trim()) {
            err.push("Sensor name is required.");
        }
        return err;
    };
    //when user presses add sensor
    const handleCreateSensor = async () => {
        //if user is logged in
        if (!token) {
            navigation.replace("Login");
            return;
        }
        //runs validation
        const validation = validate();
        //if any error exists it stops api request
        if (validation.length) {
            setErrors(validation);
            return;
        }
        //removes previous errors
        setErrors([]);
        //starts loading state
        setLoading(true);

        try {
            //backend: POST /my/plants/:id/sensors
            await userPlant.addSensor(plantId, {
                name: sensorName,
            });
            navigation.goBack();
        } catch {
            setErrors(["Failed to add sensor"]);
        } finally {
            setLoading(false);
        }
    };
    //if plant info is not loaded yet
    if (!plant) {
        return (
            <SafeAreaView style={styles.appContainer}>
                <Text style={{ color: "white" }}>
                    Loading plant...
                </Text>
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
                    <Text
                        style={[
                            styles.title,
                            { color: "white" },
                        ]}
                    >
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
                                    <Text
                                        key={i}
                                        style={{ color: "#ff6b6b" }}
                                    >
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
                            <Text style={{ fontWeight: "800" }}>
                                Plant:
                            </Text>{" "}
                            {plant.name}
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                { marginBottom: 15 },
                            ]}
                            placeholder="Sensor name"
                            value={sensorName}
                            onChangeText={setSensorName}
                        />

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