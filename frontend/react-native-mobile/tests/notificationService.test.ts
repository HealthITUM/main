// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../src/api', () => ({
  api: {
    post: jest.fn(),
  },
}))

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getDevicePushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { MAX: 5 },
}))

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}))

import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from '../src/notificationService'

beforeEach(() => jest.clearAllMocks())

describe('registerForPushNotificationsAsync', () => {
  it('returns null if permission denied', async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'denied' } as any)
    jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue({ status: 'denied' } as any)
    const result = await registerForPushNotificationsAsync()
    expect(result).toBeNull()
  })

  it('returns FCM token if permission granted', async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'granted' } as any)
    jest.mocked(Notifications.getDevicePushTokenAsync).mockResolvedValue({ data: 'fcm-token-123' } as any)
    jest.mocked(Notifications.setNotificationChannelAsync).mockResolvedValue(null as any)
    const result = await registerForPushNotificationsAsync()
    expect(result).toBe('fcm-token-123')
  })
})