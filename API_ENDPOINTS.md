# API Endpoints Reference

Complete list of all available endpoints in the Smart Library Student Module.

---

## 🔐 Authentication Endpoints

### Login
```
POST /login
Content-Type: application/x-www-form-urlencoded

Parameters:
  idNumber: string (e.g., "STU001")
  password: string

Response: Redirects to /dashboard on success
```

### Register
```
POST /register
Content-Type: application/x-www-form-urlencoded

Parameters:
  fullName: string
  idNumber: string (unique)
  phone: string
  department: string
  semester: string
  password: string
  password_confirmation: string

Response: Redirects to /login with success message
```

### Logout
```
POST /logout
Authorization: Required (student must be logged in)

Response: Redirects to /login
```

---

## 📱 Student Portal Endpoints

### Dashboard
```
GET /dashboard
Authorization: Required (student must be logged in and approved)

Response: 
{
  "props": {
    "stats": {
      "activeLoans": number,
      "overdueBooks": number,
      "totalFines": string (formatted as "₹XX.XX"),
      "recentBooks": [
        {
          "id": number,
          "title": string,
          "author": string,
          "availableCopies": number
        }
      ]
    },
    "auth": {
      "user": {
        "id": number,
        "id_number": string,
        "name": string,
        "email": string,
        "phone": string,
        "department": string,
        "semester": string,
        "is_approved": boolean
      }
    }
  }
}
```

### My Loans
```
GET /loans
Authorization: Required (student must be logged in and approved)

Response:
{
  "props": {
    "loans": [
      {
        "id": number,
        "user_id": number,
        "book_id": number,
        "book": {
          "id": number,
          "title": string,
          "author": string,
          "isbn": string
        },
        "issued_date": string (ISO 8601),
        "due_date": string (ISO 8601),
        "returned_date": string|null (ISO 8601),
        "status": "issued" | "returned",
        "fine": number|null
      }
    ],
    "stats": {
      "activeLoanCount": number,
      "overdueLoanCount": number,
      "totalOutstandingFines": string (formatted)
    }
  }
}
```

### Books Catalog
```
GET /books
Authorization: Required (student must be logged in and approved)

Response: List of all available books in the library
```

### Book Details
```
GET /books/{book_id}
Authorization: Required (student must be logged in and approved)

Parameters:
  book_id: integer (book ID)

Response: Detailed information about a specific book
```

### Library Card
```
GET /card
Authorization: Required (student must be logged in and approved)

Response: Student's library card information
```

### Calendar
```
GET /calendar
Authorization: Required (student must be logged in and approved)

Response: Library calendar and important dates
```

### Notifications
```
GET /notifications
Authorization: Required (student must be logged in and approved)

Response: Student's notifications and alerts
```

### Profile
```
GET /profile
Authorization: Required (student must be logged in and approved)

Response: Student's profile information
```

### Update Profile
```
PUT /profile
Authorization: Required (student must be logged in and approved)
Content-Type: application/x-www-form-urlencoded

Parameters:
  (Various profile fields)

Response: Redirects with success message
```

### Admin Connection Status
```
GET /admin-connection
Authorization: Required (student must be logged in and approved)

Response:
{
  "props": {
    "connection": {
      "enabled": boolean,
      "url": string|null,
      "lastSync": string|null (ISO 8601),
      "dataTracking": {
        "studentEnrollment": boolean,
        "bookLoans": boolean,
        "bookReturns": boolean,
        "fines": boolean
      }
    }
  }
}
```

---

## 🔒 Admin-Only API Endpoints

### Get All Approved Students
```
GET /api/admin/students
Authorization Headers Required:
  X-Admin-API-Key: string (from ADMIN_PANEL_API_KEY env)
  X-Admin-Secret: string (from ADMIN_PANEL_SECRET env)

Response:
{
  "students": [
    {
      "id": number,
      "id_number": string,
      "name": string,
      "email": string,
      "phone": string,
      "department": string,
      "semester": string,
      "is_approved": boolean,
      "created_at": string (ISO 8601),
      "active_loans": number,
      "overdue_books": number,
      "total_fines": number
    }
  ],
  "total": number,
  "timestamp": string (ISO 8601)
}

Status Codes:
  200: Success
  401: Missing or invalid credentials
  403: Admin panel not enabled
```

### Get Pending Student Approvals
```
GET /api/admin/approvals/pending
Authorization Headers Required:
  X-Admin-API-Key: string (from ADMIN_PANEL_API_KEY env)
  X-Admin-Secret: string (from ADMIN_PANEL_SECRET env)

Response:
{
  "pending": [
    {
      "id": number,
      "id_number": string,
      "name": string,
      "email": string,
      "phone": string,
      "department": string,
      "semester": string,
      "created_at": string (ISO 8601)
    }
  ],
  "total": number
}

Status Codes:
  200: Success
  401: Missing or invalid credentials
  403: Admin panel not enabled
```

### Get Student's Loan History
```
GET /api/admin/student/{student_id}/loans
Authorization Headers Required:
  X-Admin-API-Key: string (from ADMIN_PANEL_API_KEY env)
  X-Admin-Secret: string (from ADMIN_PANEL_SECRET env)

Path Parameters:
  student_id: integer (ID of the student)

Response:
{
  "loans": [
    {
      "id": number,
      "book_id": number,
      "book_title": string,
      "book_author": string,
      "isbn": string,
      "issued_date": string (ISO 8601),
      "due_date": string (ISO 8601),
      "returned_date": string|null (ISO 8601),
      "status": "issued" | "returned",
      "fine": number|null
    }
  ],
  "total": number
}

Status Codes:
  200: Success
  401: Missing or invalid credentials
  403: Admin panel not enabled
```

---

## 👤 Authenticated Student API Endpoints

### Get Current Student's Data
```
GET /api/student/data
Authorization Header Required:
  Authorization: Bearer {jwt_token}

Response:
{
  "student": {
    "id": number,
    "id_number": string,
    "name": string,
    "email": string,
    "phone": string,
    "department": string,
    "semester": string,
    "is_approved": boolean,
    "created_at": string (ISO 8601)
  },
  "loans": {
    "active": number,
    "overdue": number,
    "totalFines": number
  },
  "records": [
    {
      "id": number,
      "book_id": number,
      "book_title": string,
      "issued_date": string (ISO 8601),
      "due_date": string (ISO 8601),
      "returned_date": string|null (ISO 8601),
      "status": "issued" | "returned",
      "fine": number|null
    }
  ]
}

Status Codes:
  200: Success
  401: Invalid or missing JWT token
```

---

## 📊 Data Models & Structures

### User Object
```json
{
  "id": number,
  "id_number": string,
  "name": string,
  "email": string,
  "phone": string,
  "department": string,
  "semester": string,
  "profile_image": string|null,
  "is_approved": boolean,
  "created_at": string (ISO 8601),
  "updated_at": string (ISO 8601)
}
```

### Book Object
```json
{
  "id": number,
  "isbn": string,
  "title": string,
  "author": string,
  "publisher": string,
  "edition": string,
  "category": string,
  "description": string,
  "total_copies": number,
  "available_copies": number,
  "language": string,
  "publication_year": number,
  "barcode": string,
  "created_at": string (ISO 8601),
  "updated_at": string (ISO 8601)
}
```

### IssuedBook Object
```json
{
  "id": number,
  "user_id": number,
  "book_id": number,
  "book": Book|null,
  "issued_date": string (ISO 8601),
  "due_date": string (ISO 8601),
  "returned_date": string|null (ISO 8601),
  "status": "issued" | "returned",
  "fine": number|null,
  "created_at": string (ISO 8601),
  "updated_at": string (ISO 8601)
}
```

### AdminConnection Object
```json
{
  "enabled": boolean,
  "url": string|null,
  "lastSync": string|null (ISO 8601),
  "dataTracking": {
    "studentEnrollment": boolean,
    "bookLoans": boolean,
    "bookReturns": boolean,
    "fines": boolean
  }
}
```

---

## 🔄 Status Codes Reference

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | Success | Request successful |
| 301 | Redirect | Redirect (login/logout) |
| 401 | Unauthorized | Missing credentials or auth failed |
| 403 | Forbidden | Admin panel not enabled or student not approved |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Failed | Invalid request data |
| 500 | Server Error | Internal server error |

---

## 🧪 Testing with cURL

### Test Login
```bash
curl -X POST http://Smart-lib-web.test:8000/login \
  -d "idNumber=STU001&password=Student@123" \
  -c cookies.txt
```

### Test Admin API (Get All Students)
```bash
curl -X GET http://Smart-lib-web.test:8000/api/admin/students \
  -H "X-Admin-API-Key: your-api-key" \
  -H "X-Admin-Secret: your-secret"
```

### Test Student API (Get Own Data)
```bash
curl -X GET http://Smart-lib-web.test:8000/api/student/data \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 📝 Request/Response Examples

### Example: Get All Students Response
```json
{
  "students": [
    {
      "id": 1,
      "id_number": "STU001",
      "name": "John Doe",
      "email": "john@student.edu",
      "phone": "9876543210",
      "department": "Computer Science",
      "semester": "4",
      "is_approved": true,
      "created_at": "2024-01-01T10:00:00Z",
      "active_loans": 2,
      "overdue_books": 0,
      "total_fines": 50.00
    },
    {
      "id": 2,
      "id_number": "STU002",
      "name": "Jane Smith",
      "email": "jane@student.edu",
      "phone": "9876543211",
      "department": "Electronics",
      "semester": "2",
      "is_approved": true,
      "created_at": "2024-01-02T11:30:00Z",
      "active_loans": 1,
      "overdue_books": 1,
      "total_fines": 100.00
    }
  ],
  "total": 2,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Example: Get Loans Response
```json
{
  "loans": [
    {
      "id": 1,
      "book_id": 1,
      "book_title": "Clean Code",
      "book_author": "Robert C. Martin",
      "isbn": "978-0-13-468599-1",
      "issued_date": "2024-01-10",
      "due_date": "2024-02-10",
      "returned_date": null,
      "status": "issued",
      "fine": null
    },
    {
      "id": 2,
      "book_id": 2,
      "book_title": "The Pragmatic Programmer",
      "book_author": "Andrew Hunt, David Thomas",
      "isbn": "978-0-201-61622-4",
      "issued_date": "2024-01-12",
      "due_date": "2024-02-12",
      "returned_date": "2024-01-20",
      "status": "returned",
      "fine": 0
    }
  ],
  "total": 2
}
```

---

## 🔑 Authentication Methods

### Method 1: Session-Based (Student Login)
```
1. POST /login with idNumber + password
2. Laravel sets session cookie
3. Subsequent requests include cookie
4. Session auto-validated on each request
```

### Method 2: API Key + Secret (Admin Panel)
```
1. Include X-Admin-API-Key header
2. Include X-Admin-Secret header
3. AdminApiMiddleware validates both
4. Request processed if valid
```

### Method 3: JWT (Optional for API clients)
```
1. Authenticate and get JWT token
2. Include Authorization: Bearer {token} header
3. Token validated on each request
4. Token expires after configured time
```

---

## 📌 Important Notes

1. **Authentication Required**: All `/` routes except `/login` and `/register` require authentication
2. **Approval Required**: Student must have `is_approved = true` to access most features
3. **Admin APIs**: Require both `X-Admin-API-Key` AND `X-Admin-Secret` headers
4. **CORS**: Currently configured for same-origin requests
5. **Rate Limiting**: No rate limiting by default (implement in production)
6. **Timestamps**: All timestamps are in ISO 8601 format
7. **Currency**: All fine amounts in INR (₹)

---

## 🚀 Production Considerations

- Enable HTTPS (required for secure authentication)
- Implement rate limiting for admin APIs
- Add request logging and monitoring
- Set up error tracking
- Implement CORS if admin panel on different domain
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor database query performance
