import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  language: string;
  isOnline: boolean;
  selectedTab: string;
  notification: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;

  setIsDarkMode: (isDarkMode: boolean) => void;
  setLanguage: (language: string) => void;
  setIsOnline: (isOnline: boolean) => void;
  setSelectedTab: (tab: string) => void;
  showNotification: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ) => void;
  clearNotification: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  language: 'en',
  isOnline: true,
  selectedTab: 'home',
  notification: null,

  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
  setLanguage: (language) => set({ language }),
  setIsOnline: (isOnline) => set({ isOnline }),
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));
