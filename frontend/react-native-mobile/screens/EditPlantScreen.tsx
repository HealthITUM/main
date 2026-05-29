import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { specieService, userPlantService, useAuth, } from "@project/frontend-shared";
import type { ISpeciesDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//creates plant and specie api service
const userPlant = userPlantService(api);
const specie = specieService(api);

export const EditPlantScreen = ({ route, navigation }: any) => {
    //gets plant id from previous screen
    const { id } = route.params;
    //gets jwt token from authContext
    const { token } = useAuth();
    //plant name input
    const [name, setName] = useState("");
    //all species fetched from backend
    const [species, setSpecies] = useState<ISpeciesDTO[]>([]);
    //currently selected specie
    const [selectedSpecie, setSelectedSpecie] = useState<ISpeciesDTO | null>(null);
    //validation errors, api errors
    const [errors, setErrors] = useState<string[]>([]);
    //loading state
    const [loading, setLoading] = useState(false);
    const [speciesLoading, setSpeciesLoading] = useState(true);
    //includes plant and species loading
    const [pageLoading, setPageLoading] = useState(true);
    //image url for preview
    const [imagePreview, setImagePreview] = useState("");
    const [selectedSpecieId, setSelectedSpecieId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    // remove for backend - is user logged in?
    
    useEffect(() => {
        if (!token) {
            navigation.replace("Login");
        }
    }, [token, navigation]); //runs if token or navigation changes
    

    //load plant + species
    useEffect(() => {
        const load = async () => {
            //stops loading if plant id is missing
            if (!id) {
                //ends loading state
                setPageLoading(false);
                return;
            }

            try {
                //runs both api requests
                const [speciesData, plantData] = await Promise.all([
                    //backend: GET /species, returns ISpecieDTO[]
                    specie.getAll(),
                    //backend: GET /my/plants/:id
                    userPlant.getById(String(id)),
                ]);
                //stores all species in state
                setSpecies(speciesData);
                //saves plant name
                setName(plantData.name);
                //saves image preview - displays existing plant image
                setImagePreview(
                    plantData.imageUrl?.replace(
                        process.env.EXPO_PUBLIC_STORAGE_URL_LOCAL!,
                        process.env.EXPO_PUBLIC_STORAGE_URL!
                    ) || ""
                );
                setSelectedSpecieId(plantData.plantSpecieId);
                //finds matching plant species id
                const found = speciesData.find(
                    //match condition - compares species id and plant species id
                    (s) => s.id === plantData.plantSpecieId
                );
                //pre selects plant species in UI
                setSelectedSpecie(found || null);
            } catch {
                setErrors(["Failed to load plant"]);
            } finally { //runs always
                setSpeciesLoading(false);
                setPageLoading(false);
            }
        };
        load();
    }, [id]); //runs when plant id changes
    //validation
    const validate = () => {
        //stores validation errors
        const err: string[] = [];
        if (!name.trim()) err.push("Plant name is required.");
        if (!selectedSpecie) err.push("Please select a species.");
        return err;
    };
    //plant update flow
    const handleSubmit = async () => {
        //runs validation
        const validation = validate();
        //stops api request if any errors exist
        if (validation.length) {
            setErrors(validation);
            return;
        }
        //prevents invalid update request
        if (!id || !selectedSpecie) return;
        //removes old errors
        setErrors([]);
        setLoading(true);

        try {
            //backend: PATCH /my/plants/:id
            //updates plant name and species ID
            await userPlant.update(id, {
                name,
                plantSpecieId: selectedSpecie.id,
            });
            navigation.goBack();
        } catch {
            setErrors(["Failed to update plant"]);
        } finally {
            setLoading(false);
        }
    };
    //remove for backend
    if (pageLoading) return <Text>Loading...</Text>;


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
                            Edit Plant
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

                        <Text style={{ color: "white", marginBottom: 5, fontWeight: "800" }}>
                            Plant name
                        </Text>

                        <TextInput
                            style={[styles.input, { marginBottom: 10, }]}
                            placeholder="Plant name"
                            value={name}
                            onChangeText={setName}
                        />

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

                        <View style={{ position: "relative", zIndex: 2000 }}>

                            <TouchableOpacity
                                onPress={() => setOpen(true)}
                                style={[
                                    styles.input,
                                    {
                                        height: 44,
                                        justifyContent: "center",
                                        marginBottom: 10,
                                    },
                                ]}
                            >
                                <Text style={{ color: "#4B6043" }}>
                                    {selectedSpecieId
                                        ? species.find(s => s.id === selectedSpecieId)?.name
                                        : "Select species"}
                                </Text>
                            </TouchableOpacity>

                            {open && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 50,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "#A3C585",
                                        borderRadius: 8,
                                        zIndex: 9999,
                                        elevation: 50,
                                        maxHeight: 200,
                                    }}
                                >
                                    <ScrollView>
                                        {species.map((s) => (
                                            <TouchableOpacity
                                                key={s.id}
                                                onPress={() => {
                                                    setSelectedSpecieId(Number(s.id));
                                                    setOpen(false);
                                                }}
                                                style={{ padding: 12 }}
                                            >
                                                <Text style={{ color: "white" }}>
                                                    {s.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.darkGreenButton,
                                { marginTop: 15 },
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.darkGreenButtonText}>
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};