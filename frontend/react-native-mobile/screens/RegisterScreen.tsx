import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { userService } from "@project/frontend-shared";
import type { IUserRegisterRequestDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";

export const RegisterScreen = ({ navigation }: any) => {
    //form state - stores user input for registration
    const [form, setForm] = useState<IUserRegisterRequestDTO>({
        username: "",
        email: "",
        password: "",
    });
    //repeat password - ensures its correct
    const [confirmPassword, setConfirmPassword] = useState("");
    //errors
    const [error, setError] = useState("");
    //so we can use register and login
    const service = userService(api);

    const handleRegister = async () => {
        //clears previous errors
        setError("");

        // password match
        if (form.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        if (!passwordRegex.test(form.password)) {
            setError(
                "Password must be at least 6 characters long, contain 1 uppercase letter and 1 special character"
            );
            return;
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError("Invalid email format");
            return;
        }

        try {
            //sends request: POST /user/register
            await service.register(form);

            // navigate("/login")
            navigation.navigate("Login");

        } catch (err: any) {
            //backend fails
            console.log("Register error:", err);
            setError(
                err?.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    useEffect(() => {
        //when error appers is waits 3 seconds and then it automatically clears it
        if (error) {
            const t = setTimeout(() => setError(""), 3000);
            return () => clearTimeout(t);
        }
        }, [error]);

    return (
        <View style={[styles.appContainer, styles.centerContainer]}>

            <View style={styles.darkGreenCard}>

                <Text style={styles.title}>
                    Register
                </Text>

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.baseText}>Username</Text>
                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Enter username"
                        value={form.username}
                        onChangeText={(text) =>
                            setForm({ ...form, username: text })
                        }
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.baseText}>Email</Text>
                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Enter email"
                        value={form.email}
                        onChangeText={(text) =>
                            setForm({ ...form, email: text })
                        }
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.baseText}>Password</Text>
                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Enter password"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(text) =>
                            setForm({ ...form, password: text })
                        }
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.baseText}>
                        Confirm Password
                    </Text>
                    <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Re-enter password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={{ flexDirection: "row", marginTop: 22, gap: 10 }}>

                    <TouchableOpacity
                        style={[
                            styles.darkGreenButton,
                            {
                                flex: 1,
                                paddingVertical: 12
                            }
                        ]}
                        onPress={handleRegister}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Register
                        </Text>
                    </TouchableOpacity>

                    {error ? (
                            <View
                                style={{
                                    position: "absolute",
                                    top: 80,
                                    left: 20,
                                    right: 20,
                                    marginTop: 40,
                                    backgroundColor: "#ff6b6b",
                                    padding: 12,
                                    borderRadius: 10,
                                    zIndex: 999,
                                    elevation: 10,
                                }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                    <TouchableOpacity
                        style={[
                            styles.darkGreenButton,
                            {
                                flex: 1,
                                paddingVertical: 12,
                                backgroundColor: "#8aa08a"
                            }
                        ]}
                        onPress={() => navigation.replace("Home")}
                    >
                        <Text style={styles.darkGreenButtonText}>
                            Home
                        </Text>
                    </TouchableOpacity>

                </View>

                <Text
                    style={[
                        styles.baseText,
                        {
                            textAlign: "center",
                            marginTop: 20,
                            lineHeight: 20
                        }
                    ]}
                >
                    Already have an account?{" "}
                    <Text
                        style={styles.link}
                        onPress={() =>
                            navigation.navigate("Login")
                        }
                    >
                        Log in
                    </Text>
                </Text>

            </View>
        </View>
    );
};