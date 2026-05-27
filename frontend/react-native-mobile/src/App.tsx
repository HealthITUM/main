import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "@project/frontend-shared";
import { setStorage } from "@project/frontend-shared/storage";
import { storage } from "../storage/storage";
import { AppStack } from "../navigation/AppStack";

setStorage(storage);
//decides what user should see based on login state
function Router() {
  //const token = "test-token";
  const { token } = useAuth();

  return <AppStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </AuthProvider>
  );
}