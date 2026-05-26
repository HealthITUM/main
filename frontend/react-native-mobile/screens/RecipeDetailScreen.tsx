import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import type { IRecipeDTO } from "@project/shared";
import { recipeService, useAuth, userService } from "@project/frontend-shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//api object for user and recipe
const recipeApi = recipeService(api);
const userApi = userService(api);

export const RecipeDetailScreen = ({ navigation }: any) => {
    //gets route params
    const route = useRoute<any>();
    const { id } = route.params;
    //if user is logged in
    const { token } = useAuth();
    //stores logged in user data
    const [user, setUser] = useState<any>(null);
    //recipe details
    const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    //validaton, api errors
    const [error, setError] = useState<string | null>(null);

    /*useEffect(() => {
        const fetchRecipe = async () => {
            //if there is no id for plant it stops
            if (!id) {
                setError("Invalid recipe id");
                setLoading(false);
                return;
            }

            try {
                //loading screen while api request runs
                setLoading(true);
                //clears previous errors
                setError(null);
                //api request - loads recipe from api
                const data = await recipeApi.getById(id);
                //stores in state
                setRecipe(data);
            } catch {
                setError("Failed to load recipe");
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);*/ //runs when id changes

    useEffect(() => {
        const loadUser = async () => {
            try {
                //if user is not logged in it stops
                if (!token) return;
                //api request to backend - gets current user
                const me = await userApi.getMe();
                //saves user in state
                setUser(me);
            } catch {
                setUser(null);
            }
        };

        loadUser();
    }, [token]);
    //fake data
    useEffect(() => {
        const fakeRecipe: IRecipeDTO = {
            id: Number(id ?? 1),
            name: "Spaghetti Bolognese",
            description: "Classic Italian pasta with rich meat sauce.",
            authorId: 99,
            imageUrl:
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
            ingredients: [
                { id: 1, name: "spaghetti", unit: "g", amount: 200 },
                { id: 2, name: "ground beef", unit: "g", amount: 300 },
                { id: 3, name: "tomato sauce", unit: "ml", amount: 150 },
            ],
        };

        setRecipe(fakeRecipe);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <View style={styles.appContainer}>
                <Text style={{ color: "white" }}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.appContainer}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.appContainer}>
                <Text style={{ color: "white" }}>Recipe not found</Text>
            </View>
        );
    }

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

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>

                {recipe.imageUrl && (
                    <Image
                        source={{ uri: recipe.imageUrl }}
                        style={{
                            width: "100%",
                            height: 220,
                            borderRadius: 12,
                            marginBottom: 15,
                        }}
                    />
                )}

                <View style={styles.darkGreenCard}>
                    <Text style={[styles.title, { marginBottom: 10 }]}>
                        {recipe.name}
                    </Text>
                    <Text
                            style={{
                                color: "#9fbf9f",
                                fontSize: 15,
                                marginBottom: 4,
                                fontWeight: "700",
                            }}
                        >
                            DESCRIPTION
                        </Text>

                        <Text style={styles.baseText}>
                            {recipe.description}
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
                            AUTHOR ID
                        </Text>

                        <Text style={styles.baseText}>
                            {recipe.authorId}
                        </Text>
                    </View>

                <View style={[styles.darkGreenCard, { marginTop: 15 }]}>
                    <Text style={[styles.darkGreenCardTitle, { marginBottom: 15, fontSize: 18 }]}>
                        Ingredients
                    </Text>

                    {recipe.ingredients.length === 0 ? (
                        <Text style={styles.baseText}>
                            No ingredients
                        </Text>
                    ) : (
                        recipe.ingredients.map((ing) => (
                            <View
                                key={ing.id}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    borderWidth: 1,
                                    borderColor: "#2f4f2f",
                                    padding: 10,
                                    borderRadius: 8,
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={styles.baseText}>
                                    {ing.name}
                                </Text>

                                <Text style={styles.baseText}>
                                    {ing.amount} {ing.unit}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};