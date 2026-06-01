import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Storage } from "@project/frontend-shared/storage";

export const storage: Storage = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },

  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },

  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};