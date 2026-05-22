import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "@project/frontend-shared";
import { AppStack } from "../navigation/AppStack";
//decides what user should see based on login state
function Router() {
  const token = "test-token";
  //const { token } = useAuth();

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