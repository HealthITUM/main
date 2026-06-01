import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService, useAuth } from "@project/frontend-shared";
import type { IUserDTO, IUserUpdateRequestDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//api object for user
const service = userService(api);

export const EditProfileScreen = ({ navigation }: any) => {
    //gets current login token
    const { token } = useAuth();
    //current user data
    const [user, setUser] = useState<IUserDTO | null>(null);
    //username and password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //validation, api errors
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    //profile fetch
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const load = async () => {
            //no token - redirects to login
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            try {
                //api request
                const me = await service.getMe();
                //saves user in state
                setUser(me);
                //sets username field
                setUsername(me.username);
            } catch {
                setErrors(["Failed to load profile"]);
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [token, navigation]);

    const validate = () => {
        //error list
        const err: string[] = [];
        if (username && username.trim().length > 0 && username.trim().length < 3) {
            err.push("Username must be at least 3 characters");
        }
        //only runs if user typed in new password
        if (password) {
            if (!password.trim()) {
                err.push("Password cannot be empty spaces");
            } else if (password.trim().length < 6) {
                err.push("Password must be at least 6 characters");
            }
        }
        return err;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        //if error exists
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        //prevents update if user is not loaded
        if (!user) return;
        //clears errors, shows loading
        setLoading(true);
        setErrors([]);

        try {
            //data sent to backend
            const payload: IUserUpdateRequestDTO = {
                //updates username, and password
                ...(username.trim() ? { username: username.trim() } : {}),
                ...(password ? { password } : {}),
            };
            //patch request to backend
            await service.updateMe(payload);
            //clears password field
            setPassword("");
            Alert.alert("Success", "Profile updated successfully");
            navigation.navigate("Profile");
        } catch {
            setErrors(["Failed to update profile"]);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={[styles.appContainer, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4B6043" />
                <Text style={{ color: "white", marginTop: 10 }}>
                    Loading...
                </Text>
            </View>
        );
    }
    //fake data
    /*if (!user) {
        setUser({
            id: 1,
            username: "plantlover",
            email: "plantlover@plantit.com",
        });

        setUsername("plantlover");
    }*/

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
                </View>
            </View>

            <View style={{ padding: 20, marginTop: 20 }}>

                <View style={[styles.darkGreenCard, { padding: 20 }]}>

                    <Text
                        style={[
                            styles.title,
                            { textAlign: "center", marginBottom: 20 }
                        ]}
                    >
                        Edit Profile
                    </Text>

                    {errors.length > 0 && (
                        <View style={{ marginBottom: 10 }}>
                            {errors.map((e, i) => (
                                <Text key={i} style={{ color: "#ff6b6b" }}>
                                    {e}
                                </Text>
                            ))}
                        </View>
                    )}

                    <Text style={{ color: "white", fontWeight: "bold", marginBottom: 10 }}>
                        Username
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />

                    <Text style={{ color: "white", fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
                        New Password
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Leave empty if no change"
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={[styles.darkGreenButton, { marginTop: 20 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>

        </SafeAreaView>
    );
};