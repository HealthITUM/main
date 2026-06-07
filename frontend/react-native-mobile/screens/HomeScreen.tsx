import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@project/frontend-shared/AuthContext";
import { styles } from "../src/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export const HomeScreen = ({ navigation }: any) => {
    //we get token for user login state and logout so user can logout
    const { token, logout } = useAuth();
    //converst token to boolean so null is false
    const isLoggedIn = !!token;
    //controls whether acoount dropdown is visible, is open
    const [menuVisible, setMenuVisible] = useState(false);

    const handleLogout = async () => {
        //clears auth state
        await logout();
        //removes token
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
    };

    return (
    <SafeAreaView style={styles.appContainer}>
            <View
                style={[
                    styles.darkGreenNavbar,
                    { zIndex: 999, elevation: 10 }
                ]}
            >
                <Text style={[styles.title, { color: "white" }]}>
                    PlantIT
                </Text>

                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>

                <View style={{ position: "relative" }}>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => setMenuVisible(!menuVisible)}
                    >
                        <Text style={styles.profileButtonText}>
                            Account
                        </Text>
                    </TouchableOpacity>
                </View>

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
                                        <Text style={styles.dropdownText}>
                                            Login
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            navigation.navigate("Register");
                                        }}
                                    >
                                        <Text style={styles.dropdownText}>
                                            Register
                                        </Text>
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
                                        <Text style={styles.dropdownText}>
                                            Profile
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={async () => {
                                            setMenuVisible(false);
                                            await handleLogout();
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.dropdownText,
                                                { color: "#7A2E2E" },
                                            ]}
                                        >
                                            Logout
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Text
                        style={[
                            styles.title,
                            { textAlign: "center", color: "#658354" },
                        ]}
                    >
                        Welcome to PlantIT
                    </Text>

                    <Text
                        style={[
                            styles.baseText,
                            {
                                textAlign: "center",
                                marginTop: 10,
                                color: "#658354",
                            },
                        ]}
                    >
                        Manage your plants and track their care easily.
                    </Text>
                </View>

                <View style={{ padding: 20 }}>
                    <View style={styles.darkGreenCard}>
                        <Text style={styles.darkGreenCardTitle}>
                            Recipes
                        </Text>

                        <Text style={styles.baseText}>
                            Find recipes and ideas.
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.darkGreenButton,
                                { marginTop: 10 },
                            ]}
                            onPress={() => navigation.navigate("Recipes")}
                        >
                            <Text style={styles.darkGreenButtonText}>
                                Open Recipes
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[
                            styles.darkGreenCard,
                            { marginTop: 15 },
                        ]}
                    >
                        <Text style={styles.darkGreenCardTitle}>
                            My Plants
                        </Text>

                        <Text style={styles.baseText}>
                            View and manage your plant collection.
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.darkGreenButton,
                                { marginTop: 10 },
                            ]}
                            onPress={() =>
                                navigation.navigate("MyPlants")
                            }
                        >
                            <Text style={styles.darkGreenButtonText}>
                                Open
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ padding: 20 }}>
                    <View style={[styles.darkGreenCard, { backgroundColor: "#A3C585" }]}>
                        <Text
                            style={[
                                styles.darkGreenCardTitle,
                                { fontSize: 22, fontWeight: "800", color: "#4B6043" },
                            ]}
                        >
                            Discover More
                        </Text>

                        <Text style={[styles.baseText, { marginTop: 10 }]}>
                            PlantIT helps you care for your plants, discover recipes and stay connected with nature.
                        </Text>

                        <TouchableOpacity
                            onPress={() => Linking.openURL("https://plantit.com/download")}
                        >
                            <Text
                                style={{
                                    color: "#4B6043",
                                    fontWeight: "700",
                                    textDecorationLine: "underline",
                                    marginTop: 10,
                                }}
                            >
                                Download PlantIT App
                            </Text>
                        </TouchableOpacity>

                        <Text
                            style={[
                                styles.baseText,
                                { marginTop: 15, fontWeight: "800", color: "#4B6043" },
                            ]}
                        >
                            Support:
                        </Text>

                        <Text style={styles.baseText}>
                            <Text style={{ fontWeight: "800", color: "#4B6043" }}>
                                Email:{" "}
                            </Text>
                            support@plantit.com
                        </Text>

                        <Text style={styles.baseText}>
                            <Text style={{ fontWeight: "800", color: "#4B6043" }}>
                                Phone:{" "}
                            </Text>
                            +386 40 123 456
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};