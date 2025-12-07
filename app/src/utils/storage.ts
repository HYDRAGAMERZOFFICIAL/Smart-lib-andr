import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class SecureStorage {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting secure storage item ${key}:`, error);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting secure storage item ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure storage item ${key}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await SecureStore.getItemAsync('__keys');
      if (keys) {
        const keyArray = JSON.parse(keys);
        for (const key of keyArray) {
          await SecureStore.deleteItemAsync(key);
        }
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
}

export class LocalStorage {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting local storage item ${key}:`, error);
    }
  }

  static async getItem(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting local storage item ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing local storage item ${key}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
}
