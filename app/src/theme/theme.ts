import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    secondary: '#FF6B6B',
    accent: '#FDB75A',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FFA726',
    info: '#1976D2',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    disabled: '#BDBDBD',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
};

export { theme };
