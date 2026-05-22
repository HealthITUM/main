import { storage as webStorage } from "../../react-web/storage/storage";
import { storage as mobileStorage } from "../../react-native-mobile/storage/storage";

export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
//gets the one that is right for web or right for mobile
const isWeb = typeof window !== "undefined";

export const storage: Storage = isWeb ? webStorage : mobileStorage;