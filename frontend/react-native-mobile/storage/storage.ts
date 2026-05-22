import AsyncStorage from "@react-native-async-storage/async-storage";
import { Storage } from "@project/frontend-shared";

export const storage: Storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
};