import type { IUserFcmTokenRequestDTO } from '@project/shared';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api'

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // not web simulator
  if (Platform.OS === 'web') {
    return null;
  }

  let token: string | null = null;

  // checking current permissions of app
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // if no permission, asks user for it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // if user did not gave permission- exit
  if (finalStatus !== 'granted') {
    console.log('[Notifications] User did not granted app to send notifications.');
    return null;
  }

  try {
    // Get FCM token through expo
    // automatic pull `google-services.json`
    const expoTokenData = await Notifications.getDevicePushTokenAsync();
    token = expoTokenData.data;
    console.log('[Notifications] FCM Token:', token);
  } catch (error) {
    console.error('[Notifications] Error while taking token:', error);
    return null;
  }

  // Channel settings for android pushes
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F71',
    });
  }

  return token;
}

// sending token to backend
export async function sendTokenToBackend(token: string): Promise<void> {
  try {
    await api.post<IUserFcmTokenRequestDTO>('/api/user/fcm-token', {
      token,
    });
    
    console.log('[Notifications] Token is connected to user!');
  } catch (error) {
    console.error('[Notifications] Unable to send token to user:', error);
  }
}