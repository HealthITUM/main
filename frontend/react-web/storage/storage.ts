import type { Storage } from "@project/frontend-shared/storage";

export const storage: Storage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },

  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};