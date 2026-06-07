import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { userService } from "@project/frontend-shared";
import type { IUserLoginRequestDTO } from "@project/shared";
import { api } from "../src/api";
import { useAuth } from "@project/frontend-shared/AuthContext";
import { styles } from "../src/styles";

export const LoginScreen = ({ navigation }: any) => {
  //takes login from context, renames it to authLogin
  const { login: authLogin } = useAuth();
  //form state - stores user input
  const [form, setForm] = useState<IUserLoginRequestDTO>({
    username: "",
    email: "",
    password: "",
  });
  //errors messages
  const [error, setError] = useState("");
  //Usage of api object as login, register, getMe...
  const service = userService(api);

  const handleLogin = async () => {
    //clears previous error messages
    setError("");

    // basic validation (same as web)
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // API call (same as web), sends request: POST /user/login
      const res = await service.login(form);
      //returns JWT token - backend
      // localStorage equivalent -> AsyncStorage (via auth context)
      await authLogin(res.token);

      // navigate("/")
      navigation.replace("Home");
    } catch (err: any) {
      //backend fails
      console.log("Login error:", err);
      setError(err?.response?.data?.message || "Login failed");
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
    <View style={styles.appContainer}>
      <View style={styles.centerContainer}>
        <View style={styles.darkGreenCard}>
          <Text style={styles.title}>Login</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.baseText}>Username</Text>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter username"
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.baseText}>Email</Text>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.baseText}>Password</Text>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter password"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 22 }}>
            <TouchableOpacity
              style={[
                styles.darkGreenButton,
                {
                  flex: 1,
                  paddingVertical: 12,
                },
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.darkGreenButtonText}>Login</Text>
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
                  backgroundColor: "#8aa08a",
                },
              ]}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={styles.darkGreenButtonText}>Home</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.baseText,
              {
                textAlign: "center",
                marginTop: 20,
                lineHeight: 20,
              },
            ]}
          >
            Don’t have an account yet?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Create one
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
