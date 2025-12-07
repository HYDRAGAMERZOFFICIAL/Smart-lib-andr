import { ExpoConfig, getDefaultConfig } from 'expo/config';

const config: ExpoConfig = {
  ...getDefaultConfig(__dirname),
  name: 'Smart Library',
  slug: 'smart-lib-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './app/assets/icons/app-icon.png',
  userInterfaceStyle: 'light',
  scheme: 'smartlib',
  plugins: [
    [
      'expo-barcode-scanner',
      {
        cameraPermission: 'Allow Smart Library to access your camera for barcode scanning.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Smart Library to access your camera.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Smart Library to access your photos.',
        cameraPermission: 'Allow Smart Library to access your camera.',
      },
    ],
  ],
};

export default config;
