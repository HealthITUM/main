import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "@project/frontend-shared";
import { setStorage } from "@project/frontend-shared/storage";
import { storage } from "../storage/storage";
import { AppStack } from "../navigation/AppStack";
import {
  registerForPushNotificationsAsync,
  sendTokenToBackend,
} from "../src/notificationService";

setStorage(storage);

function Router() {
  const { token } = useAuth();

  /*useEffect(() => {
    const setupNotifications = async () => {
      // if we have JWT-token in memory- sending fcm token to backend
      if (token) {
        const fcmToken = await registerForPushNotificationsAsync();

        if (fcmToken) {
          await sendTokenToBackend(fcmToken);
        }
      }
    };

    setupNotifications();
  }, [token]); // any time when token is updated (login or auto-load)*/

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
