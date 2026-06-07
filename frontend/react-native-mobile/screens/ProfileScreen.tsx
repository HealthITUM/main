import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService, useAuth } from "@project/frontend-shared";
import type { IUserDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//user api service
const service = userService(api);

export const ProfileScreen = ({ navigation }: any) => {
    //gets token, logout
    const { token, logout } = useAuth();
    //currently logged in
    const [user, setUser] = useState<IUserDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            //if user is not logged in - redirect login
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            try {
                //backend - getme
                const data = await service.getMe();
                //stores user in state
                setUser(data);
            } catch (err) {
                console.error("Error loading user:", err);
                navigation.navigate("Login");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [token, navigation]); //runs if token or navigation changes

    const handleLogout = async () => {
        try {
            //removes token, sends user to login screen
            await logout();
            navigation.navigate("Login");
        } catch {
            Alert.alert("Error", "Logout failed");
        }
    };

    if (loading) {
        return (
            <View style={[styles.appContainer, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4B6043" />
                <Text style={{ color: "white", marginTop: 10 }}>
                    Loading profile...
                </Text>
            </View>
        );
    }

    if (!user) return null;
    //fake data
    /*const user: IUserDTO = {
        id: 1,
        username: "plantlover",
        email: "plantlover@plantit.com",
    };*/

    return (
        <SafeAreaView style={styles.appContainer}>
            
            <View style={styles.darkGreenNavbar}>
                <Text style={[styles.title, { color: "white" }]}>
                    PlantIT
                </Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity
                        style={styles.darkGreenButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.darkGreenButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.darkGreenButton, { backgroundColor: "#7A2E2E" }]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.darkGreenButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ padding: 20, marginTop: 20 }}>

                <View style={[styles.darkGreenCard, { padding: 20 }]}>
                    <Text style={[styles.title, { textAlign: "center", marginBottom: 20 }]}>
                        My Profile
                    </Text>

                    <Text style={{ color: "white", fontWeight: "bold", marginBottom: 10 }}>User ID</Text>
                    <View style={styles.input}>
                        <Text>{user.id}</Text>
                    </View>

                    <Text style={{ color: "white", fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
                        Username
                    </Text>
                    <View style={styles.input}>
                        <Text>{user.username}</Text>
                    </View>

                    <Text style={{ color: "white", fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
                        Email
                    </Text>
                    <View style={styles.input}>
                        <Text>{user.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.darkGreenButton, { marginTop: 20 }]}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};