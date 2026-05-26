import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { specieService, userPlantService, useAuth } from "@project/frontend-shared";
import type { ISpecieDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//API service setup - we create plant and species API service
//used for requests
const userPlant = userPlantService(api);
const specie = specieService(api);
//navigation for example for back button
export const AddPlantScreen = ({ navigation }: any) => {
    //gets authentication token from AuthContext - protects routes
    const { token } = useAuth();
    //plant name input
    const [name, setName] = useState("");
    //image file object
    const [image, setImage] = useState<any>(null);
    //local image URI for preview
    const [imagePreview, setImagePreview] = useState("");
    //species fetched from backend
    const [species, setSpecies] = useState<ISpecieDTO[]>([]);
    //currently selected species
    const [selectedSpecie, setSelectedSpecie] = useState<ISpecieDTO | null>(null);
    //validation/API errors
    const [errors, setErrors] = useState<string[]>([]);
    //sumbit and species loading
    const [loading, setLoading] = useState(false);
    const [speciesLoading, setSpeciesLoading] = useState(true);

    // species load
    useEffect(() => {
        const load = async () => {
            try {
                //backend: GET /species
                const data = await specie.getAll();
                setSpecies(data);
            } catch {
                setErrors(["Failed to load species"]);
            } finally {
                setSpeciesLoading(false);
            }
        };
        load();
    }, []); //runs once when screen loads
    //remove for backend - is user logged in?
    /*useEffect(() => {
        if (!token) {
            navigation.replace("Login");
        }
    }, [token, navigation]);*/ //runs if token or navigation is changed
    //when user presses choose image
    const pickImage = async () => {
        //opens phone gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            //images only
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            //highest quality
            quality: 1,
        });
        
        if (!result.canceled) {
            //gets selected image object
            const file = result.assets[0];
            //image is stored - used for upload and preview rendering
            setImage(file);
            setImagePreview(file.uri);
        }
    };

    const validate = () => {
        //checks if form is valid
        const err: string[] = [];
        if (!name.trim()) err.push("Plant name is required.");
        if (!image) err.push("Image is required.");
        if (!selectedSpecie) err.push("Please select a species.");
        return err;
    };
    //runs when user presses create plant
    const handleSubmit = async () => {
        //validate form, returns string
        const validation = validate();
        //if error exists it stops API request
        if (validation.length) {
            //stores errors in state
            setErrors(validation);
            return;
        }
        //clears old errors before new request
        setErrors([]);
        //starts loading state
        setLoading(true);

        try {
            //calls create - backend: POST /my/plants
            await userPlant.create({
                name,
                plantSpecieId: Number(selectedSpecie!.id),
                image: {
                    uri: image.uri,
                    name: image.fileName ?? "photo.jpg",
                    type: image.type ?? "image/jpeg",
                } as any, //any for react native file uploads
            });
            navigation.goBack();
        } catch {
            setErrors(["Failed to create plant"]);
        } finally {
            setLoading(false);
        }
    };

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
                        Add Plant
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

                    <TextInput
                        style={[styles.input, { marginBottom: 10 }]}
                        placeholder="Plant name"
                        value={name}
                        onChangeText={setName}
                    />

                    <TouchableOpacity
                        style={[styles.darkGreenButton, { marginBottom: 10 }]}
                        onPress={pickImage}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Choose Image
                        </Text>
                    </TouchableOpacity>

                    {imagePreview ? (
                        <Image
                            source={{ uri: imagePreview }}
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: 12,
                                marginBottom: 10,
                            }}
                        />
                    ) : null}

                    <Text style={{ color: "white", marginBottom: 5, fontWeight: "800" }}>
                        Species
                    </Text>

                    {speciesLoading ? (
                        <Text style={{ color: "white" }}>
                            Loading species...
                        </Text>
                    ) : (
                        species.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                onPress={() => setSelectedSpecie(s)}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    marginBottom: 5,
                                    backgroundColor:
                                        selectedSpecie?.id === s.id
                                            ? "#4a6b4a"
                                            : "#2f4f2f",
                                }}
                            >
                                <Text style={{ color: "white" }}>
                                    {s.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}

                    <TouchableOpacity
                        style={[
                            styles.darkGreenButton,
                            { marginTop: 15 },
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            {loading ? "Creating..." : "Create Plant"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            </SafeAreaView>
        </View>
    );
};