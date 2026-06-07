import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { recipeService, useAuth, userService } from "@project/frontend-shared";
import type { IRecipeDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//creates api objects
const recipeApi = recipeService(api);
const userApi = userService(api);

const fixImageUrl = (url?: string) => {
    if (!url) return undefined;

    return url.replace(
        process.env.EXPO_PUBLIC_STORAGE_URL_LOCAL!,
        process.env.EXPO_PUBLIC_STORAGE_URL!
    );
};

export const RecipesScreen = ({ navigation }: any) => {
    //gets token and function to log out
    const { token, logout } = useAuth();
    //converts token to boolean
    const isLoggedIn = !!token;
    //logged in user
    const [user, setUser] = useState<any>(null);
    //list of recipes
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    //validation, api errors
    const [error, setError] = useState<string | null>(null);
    //search input for filtering
    const [ingredientFilter, setIngredientFilter] = useState("");
    //dropdown menu visibility
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                //if user is not logged in it stops
                if (!token) return;
                //api request - gets logged in user
                const me = await userApi.getMe();
                //saves user in state
                setUser(me);
            } catch {
                setUser(null);
            }
        };
        loadUser();
    }, [token]); //runs if token changes
    //remove for backend
    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await recipeApi.getAll();
                setRecipes(data);
            } catch {
                setError("Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, []);

    //fake data
    /*useEffect(() => {
        const fakeRecipes: IRecipeDTO[] = [
            {
                id: 1,
                name: "Tomato Soup",
                description: "Classic creamy tomato soup",
                authorId: 2,
                imageUrl:
                    "https://images.unsplash.com/photo-1547592180-85f173990554",
                ingredients: [
                    { id: 3, name: "tomato", unit: "pcs", amount: 5 },
                    { id: 4, name: "garlic", unit: "clove", amount: 2 },
                ],
            },
            {
                id: 2,
                name: "Avocado Toast",
                description: "Quick breakfast option",
                authorId: 3,
                imageUrl:
                    "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
                ingredients: [
                    { id: 5, name: "avocado", unit: "pcs", amount: 1 },
                    { id: 6, name: "bread", unit: "slice", amount: 2 },
                ],
            },
        ];

        setRecipes(fakeRecipes);
        setLoading(false);
    }, []);*/

    const filteredRecipes = recipes.filter((recipe) =>
        //if empty it shows all recipes
        ingredientFilter.trim() === "" ||
        //checks ingredients list
        recipe.ingredients.some((i) =>
            //case insensitive search match
            i.name.toLowerCase().includes(ingredientFilter.toLowerCase())
        )
    );

    const handleDelete = async (recipeId: number) => {
        try {
            //request to delete user
            await recipeApi.delete(String(recipeId));
            //removes recipe locally from ui
            setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        } catch {
            setError("Failed to delete recipe");
        }
    };

    const renderRecipe = ({ item }: { item: IRecipeDTO }) => {
        //for showing delete button
        const isOwner =
            !!token &&
            !!user &&
            item.authorId === user.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.darkGreenCard, { marginBottom: 20 }]}
                onPress={() =>
                    navigation.navigate("RecipeDetails", { id: item.id })
                }
            >
            {item.imageUrl ? (
                <Image
                    source={{ uri: fixImageUrl(item.imageUrl) }}
                    style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                />
            ) : null}

            <Text style={[styles.darkGreenCardTitle, { fontSize: 30 }]}>
                {item.name}
            </Text>

            <View style={{ marginBottom: 10 }}>
                <Text
                    style={{
                        color: "#9fbf9f",
                        fontSize: 18,
                        fontWeight: "700",
                        marginBottom: 4,
                        marginTop: 10,
                    }}
                >
                    DESCRIPTION
                </Text>

                <Text style={{ color: "white", fontSize: 15 }}>
                    {item.description}
                </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text
                    style={{
                        color: "#9fbf9f",
                        fontSize: 18,
                        fontWeight: "700",
                        marginBottom: 4,
                    }}
                >
                    AUTHOR ID
                </Text>

                <Text style={{ color: "white", fontSize: 15 }}>
                    {item.authorId}
                </Text>
            </View>
            
                 {isOwner && (
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 15,
                    }}
                >
                    <TouchableOpacity
                        style={[
                            styles.darkGreenButton,
                            {
                                flex: 1,
                                backgroundColor: "#7A2E2E",
                            },
                        ]}
                        onPress={() => {
                            Alert.alert(
                                "Delete recipe",
                                "Are you sure you want to delete this recipe?",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Delete",
                                        style: "destructive",
                                        onPress: () => handleDelete(item.id),
                                    },
                                ]
                            );
                        }}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
                 )} 
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.appContainer}>
                <Text style={styles.baseText}>Loading...</Text>
            </SafeAreaView>
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
                           zIndex: 999,
                           elevation: 10,
                           paddingHorizontal: 12,
                           },
                       ]}
                       >
                       <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                           <Text style={[styles.title, { color: "white" }]}>
                           PlantIT
                           </Text>
       
                           <TouchableOpacity
                           style={styles.darkGreenButton}
                           onPress={() => navigation.navigate("Home")}
                           >
                           <Text style={styles.darkGreenButtonText}>
                               Back
                           </Text>
                           </TouchableOpacity>
                       </View>
       
                       <View style={{ position: "relative" }}>
                           <TouchableOpacity
                           style={styles.profileButton}
                           onPress={() => setMenuVisible(!menuVisible)}
                           >
                           <Text style={styles.profileButtonText}>
                               Account
                           </Text>
                           </TouchableOpacity>
       
                           {menuVisible && (
                           <View
                               style={[
                               styles.dropdownMenu,
                               {
                                   position: "absolute",
                                   top: 45,
                                   right: 0,
                                   zIndex: 9999,
                                   elevation: 20,
                               },
                               ]}
                           >
                               {!isLoggedIn ? (
                               <>
                                   <TouchableOpacity
                                   style={styles.dropdownItem}
                                   onPress={() => {
                                       setMenuVisible(false);
                                       navigation.navigate("Login");
                                   }}
                                   >
                                   <Text style={styles.dropdownText}>Login</Text>
                                   </TouchableOpacity>
       
                                   <TouchableOpacity
                                   style={styles.dropdownItem}
                                   onPress={() => {
                                       setMenuVisible(false);
                                       navigation.navigate("Register");
                                   }}
                                   >
                                   <Text style={styles.dropdownText}>Register</Text>
                                   </TouchableOpacity>
                               </>
                               ) : (
                               <>
                                   <TouchableOpacity
                                   style={styles.dropdownItem}
                                   onPress={() => {
                                       setMenuVisible(false);
                                       navigation.navigate("Profile");
                                   }}
                                   >
                                   <Text style={styles.dropdownText}>Profile</Text>
                                   </TouchableOpacity>
       
                                   <TouchableOpacity
                                   style={styles.dropdownItem}
                                   onPress={async () => {
                                       setMenuVisible(false);
                                       await logout();
                                       navigation.navigate("Login");
                                   }}
                                   >
                                   <Text style={[styles.dropdownText, { color: "#7A2E2E" }]}>
                                       Logout
                                   </Text>
                                   </TouchableOpacity>
                               </>
                               )}
                           </View>
                           )}
                       </View>
                       </View>
       
                   <View
                       style={{
                           alignItems: "flex-end",
                           paddingHorizontal: 20,
                       }}
                   >
                       <TouchableOpacity
                           style={[
                               styles.darkGreenButton,
                               {
                                   borderTopLeftRadius: 0,
                                   borderTopRightRadius: 0,
                               }
                           ]}
                           onPress={() =>
                               navigation.navigate("AddRecipe")
                           }
                       >
                           <Text style={styles.darkGreenButtonText}>
                               + Add Recipe
                           </Text>
                       </TouchableOpacity>
                   </View>
       
            <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 100,
                }}
                ListHeaderComponent={
                    <>
                        <Text
                            style={[
                                styles.title,
                                {
                                    marginBottom: 20,
                                    color: "#658354",
                                    fontWeight: "800",
                                },
                            ]}
                        >
                            Recipes
                        </Text>

                        <View style={[styles.darkGreenCard, { marginBottom: 20 }]}>
                            <Text style={styles.darkGreenCardTitle}>
                                Search ingredient
                            </Text>

                            <TextInput
                                style={[styles.input, { marginTop: 10 }]}
                                placeholder="e.g. basil"
                                value={ingredientFilter}
                                onChangeText={setIngredientFilter}
                            />
                        </View>

                        {!!error && (
                            <View
                                style={{
                                    backgroundColor: "#ff6b6b",
                                    padding: 12,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                }}
                            >
                                <Text style={{ color: "white" }}>
                                    {error}
                                </Text>
                            </View>
                        )}
                    </>
                }
                renderItem={renderRecipe}
            />
        </SafeAreaView>
    );
};