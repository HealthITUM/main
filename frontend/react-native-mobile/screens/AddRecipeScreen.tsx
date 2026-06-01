import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { recipeService, useAuth, userService } from "@project/frontend-shared";
import type { IIngredientHasRecipeDTO, IUserDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//creates api objects for recipes and users
const recipeApi = recipeService(api);
const userApi = userService(api);
//navigation
export const AddRecipeScreen = ({ navigation }: any) => {
    //gets current login token
    const { token } = useAuth();
    //logged in user
    const [user, setUser] = useState<IUserDTO | null>(null);
    //recipes data
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    //array of ingredients
    const [ingredients, setIngredients] = useState<IIngredientHasRecipeDTO[]>([]);
    //image and preview
    const [image, setImage] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState("");
    //validation, api errors
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    //which ingredient unit dropdown is open
    const [unitModalIndex, setUnitModalIndex] = useState<number | null>(null);

    //remove for backend
    useEffect(() => {
        requestPermissions();
        const loadUser = async () => {
            try {
                //if there is no token user is redirected to login screen
                if (!token) {
                    setUser(null);
                    navigation.navigate("Login");
                    return;
                }
                //fetches current user
                const me = await userApi.getMe();
                //stores in state
                setUser(me);
            } catch {
                navigation.navigate("Login");
            }
        };
        loadUser();
    }, [token]); //runs if token changes
    
    const pickImage = async () => {
        //opens phone galllery - waits for user selection
        const result = await ImagePicker.launchImageLibraryAsync({
            //only allows selecting images - no videos
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //crop, edit
            allowsEditing: true,
            //max quality
            quality: 1,
        });
        //check if user didnt cancel image selection
        if (!result.canceled) {
            //takes first selected image - 0 is first image
            const file = result.assets[0];
            //saves full image object
            setImage(file);
            //saves image URL for UI preview
            setImagePreview(file.uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            const file = result.assets[0];
            setImage(file);
            setImagePreview(file.uri);
        }
    };

    const requestPermissions = async () => {
        const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const camera = await ImagePicker.requestCameraPermissionsAsync();
    
        if (!media.granted || !camera.granted) {
            alert("Permissions are required to use this feature.");
        }
    };

    const addIngredient = () => {
        //updates ingredients state using previous state
        setIngredients(prev => [
            //keeps all existing ingr.
            ...prev,
            {
                //unique id
                id: Date.now(),
                name: "",
                unit: "pcs",
                amount: 1,
            },
        ]);
    };

    const updateIngredient = (
        //which ingredient in array to update
        index: number,
        //which property to update
        field: keyof IIngredientHasRecipeDTO,
        //new
        value: any
    ) => {
        //updates state based on previous value
        setIngredients(prev =>
            //loop through all ingredients
            prev.map((ing, i) =>
                //if its the ingr. we want to update
                i === index
                    //update only one field dynamically
                    ? { ...ing, [field]: value }
                    //if not target ingredient - unchanged
                    : ing
            )
        );
    };

    const removeIngredient = (index: number) => {
        //keeps all ingredients except the one at index
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const validate = () => {
        //array for error msg
        const e: string[] = [];
        if (!name.trim()) e.push("Recipe name is required.");
        if (!description.trim()) e.push("Description is required.");
        if (ingredients.length === 0) e.push("Add at least one ingredient.");
        if (ingredients.some(i => !i.name.trim())) {
            e.push("All ingredients must have a name.");
        }
        return e;
    };

    const handleSubmit = async () => {
        //clears previous errors
        setErrors([]);
        const validation = validate();
        //if error exists - stops api call
        if (validation.length > 0) {
            setErrors(validation);
            return;
        }
        //user needs to be logged in
        if (!token || !user) {
            navigation.navigate("Login");
            return;
        }
        //shows loading state
        setLoading(true);

        try {
            //request to backend
            await recipeApi.create({
                //sends form data fields
                name,
                description,
                ingredients,
                //if image exists - convert
                image: image
                ? ({
                    uri: image.uri,
                    name: image.fileName ?? "photo.jpg",
                    type: image.type ?? "image/jpeg",
                } as unknown as File) //creates object as file
                : (undefined as unknown as File), //if no image -
            });
            navigation.navigate("Recipes", { replace: true });
        } catch {
            Alert.alert("Error", "Failed to create recipe");
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
                        RecipeIT
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

                        <Text style={[styles.title, {
                            textAlign: "center",
                            marginBottom: 15,
                        }]}>
                            Add Recipe
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
                            placeholder="Recipe name"
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput
                            style={[styles.input, { marginBottom: 10 }]}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[styles.darkGreenButton, { flex: 1, alignItems: "center", justifyContent: "center" }]}
                                onPress={pickImage}
                            >
                                <Text style={styles.darkGreenButtonText}>
                                    Choose Image from Gallery
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.darkGreenButton, { flex: 1, alignItems: "center", justifyContent: "center" }]}
                                onPress={takePhoto}
                            >
                                <Text style={styles.darkGreenButtonText}>
                                    Take Photo
                                </Text>
                            </TouchableOpacity>

                        </View>

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

                        <Text style={{ color: "white", marginBottom: 5, fontWeight: 800}}>
                            Ingredients
                        </Text>
                        {ingredients.map((ing, index) => (
                            <View
                                key={ing.id}
                                style={{
                                    flexDirection: "row",
                                    gap: 8,
                                    marginBottom: 8,
                                    alignItems: "center",
                                }}
                            >
                                <TextInput
                                    style={[styles.input, { flex: 2 }]}
                                    placeholder="Name"
                                    value={ing.name}
                                    onChangeText={(v) =>
                                        updateIngredient(index, "name", v)
                                    }
                                />

                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    keyboardType="numeric"
                                    value={String(ing.amount)}
                                    onChangeText={(v) =>
                                        updateIngredient(index, "amount", Number(v))
                                    }
                                />

                                <View style={{ flex: 1, position: "relative", zIndex: 1000}}>
                                    <TouchableOpacity
                                        onPress={() => setUnitModalIndex(index)}
                                        style={[
                                            styles.input,
                                            {
                                                justifyContent: "center",
                                                height: 44,
                                            },
                                        ]}
                                    >
                                        <Text style={{ color: "#4B6043" }}>
                                            {String(ing.unit)}
                                        </Text>
                                    </TouchableOpacity>

                                    {unitModalIndex === index && (
                                        <View
                                            style={{
                                                position: "absolute",
                                                top: 45,
                                                right: 0,
                                                backgroundColor: "#2f4f2f",
                                                borderRadius: 8,
                                                zIndex: 9999,
                                                width: 80,
                                                elevation: 50,
                                            }}
                                        >
                                            {["pcs", "g", "mg", "ml"].map((u) => (
                                                <TouchableOpacity
                                                    key={u}
                                                    onPress={() => {
                                                        updateIngredient(index, "unit", u);
                                                        setUnitModalIndex(null);
                                                    }}
                                                    style={{
                                                        padding: 10,
                                                    }}
                                                >
                                                    <Text style={{ color: "white", textAlign: "center" }}>
                                                        {u}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={() => removeIngredient(index)}
                                    style={[
                                        styles.darkGreenButton,
                                        { backgroundColor: "#7A2E2E" },
                                    ]}
                                >
                                    <Text style={styles.darkGreenButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[styles.darkGreenButton, { marginTop: 10 }]}
                            onPress={addIngredient}
                        >
                            <Text style={styles.darkGreenButtonText}>
                                + Add ingredient
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.darkGreenButton, { marginTop: 20 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.darkGreenButtonText}>
                                {loading ? "Creating..." : "Create Recipe"}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

            </SafeAreaView>
        </View>
    );
};