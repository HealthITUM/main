import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "react-native-app",
  slug: "react-native-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "../assets/icon.jpg",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "../assets/icon.jpg",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    package: process.env.FIREBASE_PACKAGE_NAME || "com.com.com", 
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "../assets/icon.jpg",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
  },
  web: {
    favicon: "../assets/icon.jpg"
  }
});