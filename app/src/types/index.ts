export interface User {
  id: string;
  idNumber: string;
  name: string;
  email?: string;
  phone: string;
  department: string;
  semester: string;
  profileImage?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  category: string;
  description: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  language: string;
  publicationYear: number;
  barcode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuedBook {
  id: string;
  userId: string;
  bookId: string;
  issuedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'issued' | 'returned';
  fine?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCard {
  id: string;
  userId: string;
  cardNumber: string;
  barcode: string;
  qrCode: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface AcademicCalendar {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: 'holiday' | 'exam' | 'closed' | 'announcement';
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: User;
  };
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface FilterOptions {
  category?: string;
  availability?: 'available' | 'issued';
  semester?: string;
  sortBy?: 'title' | 'author' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  type: 'title' | 'author' | 'isbn' | 'category';
  page?: number;
  limit?: number;
}

export interface LoginPayload {
  idNumber: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  idNumber: string;
  phone: string;
  department: string;
  semester: string;
  password: string;
  confirmPassword: string;
  profilePhoto?: string;
}

export interface UpdateProfilePayload {
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  BookDetail: { bookId: string };
  LoanDetail: { loanId: string };
  ScanBarcode: { type: 'book' | 'card' };
  Notifications: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Verification: { idNumber: string };
};

export type MainStackParamList = {
  Home: undefined;
  Books: undefined;
  Card: undefined;
  Profile: undefined;
};

export interface FormError {
  field: string;
  message: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: ApiError | null;
}

export interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, number>;
  typography: Record<string, any>;
}
