export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.1:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LIBRARY_CARD: 'library_card',
  SETTINGS: 'settings',
  LAST_SYNC: 'last_sync',
};

export const APP_ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
    VERIFICATION: 'Verification',
  },
  MAIN: {
    HOME: 'Home',
    BOOKS: 'Books',
    CARD: 'Card',
    PROFILE: 'Profile',
  },
  COMMON: {
    SPLASH: 'Splash',
    NOTIFICATIONS: 'Notifications',
    SETTINGS: 'Settings',
    ABOUT: 'About',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  BOOKS: {
    LIST: '/books',
    SEARCH: '/books/search',
    DETAIL: '/books/:bookId',
    BY_BARCODE: '/books/barcode/:barcode',
  },
  LOANS: {
    ACTIVE: '/loans/active',
    HISTORY: '/loans/history',
    DETAIL: '/loans/:loanId',
  },
  CARD: {
    GET: '/library-card',
  },
  CALENDAR: {
    GET: '/calendar',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:notificationId/read',
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid ID or password.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
};

export const PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
};

export const NOTIFICATION_TYPES = {
  APPROVAL: 'approval',
  BOOK_ISSUED: 'book_issued',
  BOOK_RETURNED: 'book_returned',
  DUE_REMINDER: 'due_reminder',
  OVERDUE: 'overdue',
  ANNOUNCEMENT: 'announcement',
};

export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Self-Help',
  'Reference',
  'Educational',
  'Other',
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 30 * 60 * 1000,
  LONG: 24 * 60 * 60 * 1000,
};

export const SYNC_INTERVALS = {
  BACKGROUND_SYNC: 2 * 60 * 60 * 1000,
  NOTIFICATION_CHECK: 15 * 60 * 1000,
};
