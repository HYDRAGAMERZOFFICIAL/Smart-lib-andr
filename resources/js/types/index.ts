export interface User {
  id: number;
  idNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  profileImage?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: number;
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
  id: number;
  userId: number;
  bookId: number;
  issuedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'issued' | 'returned';
  fine?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCard {
  id: number;
  userId: number;
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
  id: number;
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
  id: number;
  userId: number;
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
    user: User;
  };
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
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
}
