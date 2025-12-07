# Admin Panel Connectivity Guide

This student module is built with secure connectivity to the admin panel. The admin panel can monitor and manage all student activities without any additional setup on the student side.

## Overview

The student module exposes secure API endpoints that the admin panel can consume to:
- View all students and their approval status
- Monitor book loans and returns in real-time
- Track outstanding fines and payments
- Process student approvals
- Access student-specific data

## How It Works

### 1. **Configuration (Admin Panel Provides)**

The admin panel administrator will provide the following credentials:
```
ADMIN_PANEL_ENABLED=true
ADMIN_PANEL_URL=http://admin-panel-url.com
ADMIN_PANEL_API_KEY=generated-api-key
ADMIN_PANEL_SECRET=generated-secret-key
ADMIN_PANEL_DATABASE_HOST=admin-db-host
ADMIN_PANEL_DATABASE_PORT=3306
ADMIN_PANEL_DATABASE_USER=admin-db-user
ADMIN_PANEL_DATABASE_PASSWORD=admin-db-password
ADMIN_PANEL_DATABASE_NAME=admin-db-name
```

### 2. **Update .env File**

Once you receive the credentials from the admin panel, update `.env`:
```bash
ADMIN_PANEL_ENABLED=true
ADMIN_PANEL_URL=http://admin-panel.example.com
ADMIN_PANEL_API_KEY=your-api-key-here
ADMIN_PANEL_SECRET=your-secret-here
ADMIN_PANEL_DATABASE_HOST=admin.database.com
ADMIN_PANEL_DATABASE_PORT=3306
ADMIN_PANEL_DATABASE_USER=admin_user
ADMIN_PANEL_DATABASE_PASSWORD=admin_password
ADMIN_PANEL_DATABASE_NAME=admin_database
```

## API Endpoints Available to Admin Panel

### 1. **Get All Students**
```
GET /api/admin/students
Headers:
  X-Admin-API-Key: {ADMIN_PANEL_API_KEY}
  X-Admin-Secret: {ADMIN_PANEL_SECRET}

Response:
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
      "total_fines": 0
    }
  ],
  "total": 10,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. **Get Pending Approvals**
```
GET /api/admin/approvals/pending
Headers:
  X-Admin-API-Key: {ADMIN_PANEL_API_KEY}
  X-Admin-Secret: {ADMIN_PANEL_SECRET}

Response:
{
  "pending": [
    {
      "id": 2,
      "id_number": "STU002",
      "name": "Jane Smith",
      "email": "jane@student.edu",
      "phone": "9876543211",
      "department": "Electronics",
      "semester": "2",
      "created_at": "2024-01-14T15:30:00Z"
    }
  ],
  "total": 3
}
```

### 3. **Get Student's Loan History**
```
GET /api/admin/student/{id}/loans
Headers:
  X-Admin-API-Key: {ADMIN_PANEL_API_KEY}
  X-Admin-Secret: {ADMIN_PANEL_SECRET}

Response:
{
  "loans": [
    {
      "id": 5,
      "book_id": 2,
      "book_title": "Clean Code",
      "book_author": "Robert C. Martin",
      "isbn": "978-0-13-468599-1",
      "issued_date": "2024-01-10",
      "due_date": "2024-02-10",
      "returned_date": null,
      "status": "issued",
      "fine": null
    }
  ],
  "total": 5
}
```

### 4. **Get Student's Personal Data**
```
GET /api/student/data
Headers:
  Authorization: Bearer {JWT_TOKEN}

Response:
{
  "student": {
    "id": 1,
    "id_number": "STU001",
    "name": "John Doe",
    "email": "john@student.edu",
    "phone": "9876543210",
    "department": "Computer Science",
    "semester": "4",
    "is_approved": true,
    "created_at": "2024-01-01T10:00:00Z"
  },
  "loans": {
    "active": 2,
    "overdue": 0,
    "totalFines": 0
  },
  "records": [...]
}
```

## Data Tracking

The following student data is automatically tracked and available to the admin panel:

✅ **Student Enrollment**
- Student registration information
- Approval status
- Department and semester information

✅ **Book Loans**
- Issue dates
- Due dates
- Book details

✅ **Book Returns**
- Return dates
- Status updates

✅ **Fines & Payments**
- Outstanding fines
- Fine amounts
- Payment history

## Security

- All admin API endpoints require valid `X-Admin-API-Key` and `X-Admin-Secret` headers
- Database credentials are stored securely in `.env` and never exposed
- Student data is isolated per user
- All requests are logged
- API keys should be rotated regularly

## Student View

Students can view the connectivity status at:
```
http://your-domain/admin-connection
```

This page shows:
- Connection status
- Last synchronization time
- What data is being tracked
- Secure badge verification

## Setup Steps

1. **Wait for Admin Panel Admin** to provide credentials
2. **Update `.env`** with the provided credentials
3. **Set `ADMIN_PANEL_ENABLED=true`**
4. **Restart Laravel server** for changes to take effect
5. **Verify** by visiting the admin connection status page

## Troubleshooting

### Connection Failed
- Verify `ADMIN_PANEL_ENABLED` is `true`
- Check API key and secret are correct
- Ensure database credentials are valid
- Check network connectivity to admin database

### No Data Syncing
- Verify student accounts are approved (`is_approved = true`)
- Check if there are actual loans created
- Review server logs for errors

### API Returns 401 Unauthorized
- Verify headers are being sent correctly
- Check API key and secret match configured values
- Ensure headers are in exact format: `X-Admin-API-Key` and `X-Admin-Secret`

## Support

For issues with admin panel connectivity, contact your library administrator with:
- Error messages from server logs
- Configuration status (enabled/disabled)
- Last successful sync time
- Any network errors observed
