import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Alert, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userPlantService, userService, useAuth, } from "@project/frontend-shared";
import type { IUserDTO, IUserPlantDTO, } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//creates api service instances for plants and service like get me
const userPlant = userPlantService(api);
const service = userService(api);

export const MyPlantsScreen = ({ navigation }: any) => {
    //token exist if user is logged in, logout for clering session
    const { token, logout } = useAuth();
    //boolean version
    const isLoggedIn = !!token;
    //list of plants from api
    const [plants, setPlants] = useState<IUserPlantDTO[]>([]);
    //loading states
    const [loadingPlants, setLoadingPlants] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    //error messages - validation, api errors
    const [error, setError] = useState<string | null>(null);
    //logged in user info
    const [user, setUser] = useState<IUserDTO | null>(null);
    //search input text
    const [nameFilter, setNameFilter] = useState("");
    //control for dropdown menu
    const [menuVisible, setMenuVisible] = useState(false);
    //remove for backend
    /*// load user
    useEffect(() => {
        //checks if there is token for user if no then redirects to login screen
        if (!token) {
            navigation.replace("Login");
            return;
        }

        const loadUser = async () => {
            try {
                //calls backend for /me
                const me = await service.getMe();
                //stores user info
                setUser(me);
            } catch {
                //if api fails it log outs user - redirect to login
                await logout();
                navigation.replace("Login");
            } finally {
                setLoadingUser(false);
            }
        };
        loadUser();
    }, []);*/ //loads when page is opened

    //load plants
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                //backend for get plants
                const data = await userPlant.getAll();
                //stored data in plants
                setPlants(data);
            } catch {
                setError("Failed to load plants");
            } finally {
                setLoadingPlants(false);
            }
        };
        fetchPlants();
    }, []); //runs when page is opened

    //filter
    const filteredPlants = plants.filter((plant) =>
        //if search is empty it shows all
        nameFilter.trim() === "" ||
        //otherwise it shows only plants matching the name
        plant.name
            .toLowerCase()
            .includes(nameFilter.toLowerCase())
    );

    //delete - takes plantID
    const handleDelete = async (plantId: number) => {
        //shows popup - user must confirm
        Alert.alert(
            "Delete plant",
            "Delete this plant?",
            [
                //if cancel it does nothing - closes popup
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            //calls backend api for delete
                            await userPlant.delete(String(plantId));
                            //updates UI, prev is current plant list
                            setPlants((prev) =>
                                //removes deleted plant, creates new array without this plant
                                prev.filter((p) => p.id !== plantId));
                        } catch {
                            setError(
                                "Failed to delete plant"
                            );
                        }
                    },
                },
            ]
        );
    };

    //remove for backend
    //blocks ui until user and plants are loaded
   /* if (loadingUser || loadingPlants) {
        return (
            <SafeAreaView style={styles.appContainer}>
                <Text style={styles.baseText}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }*/

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
                    onPress={() => navigation.goBack()}
                    >
                    <Text style={styles.darkGreenButtonText}>
                        Back
                    </Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                    style={[
                        styles.darkGreenButton,
                        {
                            backgroundColor: "#658354",
                        },
                    ]}
                    onPress={() =>
                        navigation.navigate("PlantDetails", {
                            id: 123, // fake ID for test, this button only for test
                        })
                    }
                >
                    <Text style={styles.darkGreenButtonText}>
                        Details
                    </Text>
                </TouchableOpacity>

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
                            <Text style={[styles.dropdownText, { color: "#b23b3b" }]}>
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
                        navigation.navigate("CreatePlant")
                    }
                >
                    <Text style={styles.darkGreenButtonText}>
                        + Add Plant
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredPlants}

                keyExtractor={(item) =>
                    item.id.toString()
                }

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
                                    fontWeight: "800"
                                 }
                            ]}
                        >
                            My Plants
                        </Text>

                        <View
                            style={[
                                styles.darkGreenCard,
                                { marginBottom: 20 }
                            ]}
                        >

                            <Text
                                style={
                                    styles.darkGreenCardTitle
                                }
                            >
                                Search plant
                            </Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    { marginTop: 10 }
                                ]}
                                placeholder="Plant name..."
                                value={nameFilter}
                                onChangeText={ setNameFilter }
                            />

                        </View>

                        {error ? (
                            <View
                                style={{
                                    backgroundColor:
                                        "#7A2E2E",
                                    padding: 12,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                    </>
                }

                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.darkGreenCard,
                            {
                                marginBottom: 20,
                            }
                        ]}
                        onPress={() =>
                            navigation.navigate(
                                "PlantDetails",
                                {
                                    id: item.id
                                }
                            )
                        }
                    >
                        {item.imageUrl ? (
                            <Image
                                source={{
                                    uri: item.imageUrl
                                }}
                                style={{
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 12,
                                    marginBottom: 12,
                                }}
                            />
                        ) : null}

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("PlantDetails", {
                                    id: item.id,
                                })
                            }
                        >
                            <Text
                                style={[
                                    styles.darkGreenCardTitle,
                                    { textDecorationLine: "underline" },
                                ]}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.baseText}>
                            Species ID:{" "}
                            {item.plantSpecieId}
                        </Text>

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
                                    { flex: 1 }
                                ]}
                                onPress={() =>
                                    navigation.navigate( "EditPlant",
                                        {
                                            id: item.id
                                        }
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.darkGreenButtonText
                                    }
                                >
                                    Edit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.darkGreenButton,
                                    {
                                        flex: 1,
                                        backgroundColor:
                                            "#7A2E2E",
                                    }
                                ]}

                                onPress={() =>
                                    handleDelete(item.id)
                                }
                            >
                                <Text
                                    style={
                                        styles.darkGreenButtonText
                                    }
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};