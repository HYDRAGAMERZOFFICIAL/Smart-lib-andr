export interface User {
  id: number;
  id_number: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  profile_image?: string;
  is_approved: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  category: string;
  description: string;
  total_copies: number;
  available_copies: number;
  language: string;
  publication_year: number;
  barcode: string;
}

export interface IssuedBook {
  id: number;
  user_id: number;
  book_id: number;
  book?: Book;
  issued_date: string;
  due_date: string;
  returned_date?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number;
}

export interface AdminConnection {
  enabled: boolean;
  url?: string;
  lastSync?: string;
  dataTracking: {
    studentEnrollment: boolean;
    bookLoans: boolean;
    bookReturns: boolean;
    fines: boolean;
  };
}
