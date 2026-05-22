import type { Storage } from "@project/frontend-shared";

export const storage: Storage = {
  async getItem(key: string) {
    return Promise.resolve(localStorage.getItem(key));
  },

  async setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  async removeItem(key: string) {
    localStorage.removeItem(key);
  },
};