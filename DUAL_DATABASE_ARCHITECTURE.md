# Dual Database Architecture - Smart Library System

## Overview

The Smart Library system uses a **dual-database architecture** to separate student and admin data while maintaining data consistency. This document explains the structure, configuration, and usage.

---

## Database Configuration

### 1. **Database Setup**

**Student Database**: `smart_lib`
- Contains: User, Loan, LibraryCard, Notification data
- Access: Students can read/write their own data
- Primary connection: `mysql` (default)

**Admin Database**: `smart_lib_admin`  
- Contains: Book, AcademicCalendarEvent, and Student approval data
- Access: Admin can read/write; Students can only read
- Connection: `mysql_admin`

### 2. **Environment Configuration** (`.env`)

```env
# Student Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_lib
DB_USERNAME=root
DB_PASSWORD=

# Admin Database
ADMIN_DB_CONNECTION=mysql_admin
ADMIN_DB_HOST=127.0.0.1
ADMIN_DB_PORT=3306
ADMIN_DB_DATABASE=smart_lib_admin
ADMIN_DB_USERNAME=root
ADMIN_DB_PASSWORD=
```

### 3. **Database Connection Configuration** (`config/database.php`)

Both connections are defined as MySQL connections:
- `mysql` → Student database
- `mysql_admin` → Admin database

---

## Architecture Components

### 1. **Models**

#### Student Database Models (Default Connection)
```
App\Models\User               → Student users
App\Models\Loan               → Student loans
App\Models\LibraryCard        → Digital library cards
App\Models\Notification       → Student notifications
```

**Connection**: `mysql` (default, no explicit connection needed)

#### Admin Database Models (Admin Connection)
```
App\Models\AdminBook           → Read-only for students
App\Models\AdminAcademicCalendarEvent → Read-only for students
```

**Connection**: `mysql_admin` (explicitly set in model)

#### Usage Example:
```php
// Student can READ from admin database
$books = AdminBook::all();  // Reads from smart_lib_admin

// Student CANNOT write to admin database
// AdminBook::create([...]) would fail or require authorization

// Student can read/write own data
$profile = User::find($userId);
$profile->update(['phone' => '1234567890']);
```

### 2. **Repositories**

#### AdminDataRepository
- **Purpose**: Abstract read-only access to admin database tables
- **Methods**:
  - `getAllBooks()` - Get all books
  - `getBooksByCategory()` - Filter by category
  - `getBooksByCourse()` - Filter by course/semester
  - `getAvailableBooks()` - Only available books
  - `searchBooks()` - Search functionality
  - `getBook()` - Get single book
  - `getBookByBarcode()` - Scan barcode
  - `getAllAcademicEvents()` - Get calendar events
  - `getUpcomingAcademicEvents()` - Upcoming events
  - `getAcademicEventsByType()` - Filter by type
  - `getAcademicEvent()` - Get single event

**Location**: `app/Repositories/AdminDataRepository.php`

#### StudentDataRepository
- **Purpose**: Handle read/write access to student database
- **Methods**:
  - `getStudentProfile()` - Get student profile
  - `updateStudentProfile()` - Update own profile
  - `getActiveLoans()` - Get current loans
  - `getLoanHistory()` - Get past loans
  - `getLibraryCard()` - Get library card
  - `getNotifications()` - Get unread notifications
  - `getNotificationHistory()` - Get all notifications
  - `getLoansDueSoon()` - Get loans due in X days
  - `getOverdueLoans()` - Get overdue loans

**Location**: `app/Repositories/StudentDataRepository.php`

### 3. **Service Provider**

**RepositoryServiceProvider** (`app/Providers/RepositoryServiceProvider.php`)

Registers repositories as singletons for dependency injection:

```php
$this->app->singleton(AdminDataRepository::class, function ($app) {
    return new AdminDataRepository();
});

$this->app->singleton(StudentDataRepository::class, function ($app) {
    return new StudentDataRepository();
});
```

Register in `config/app.php`:
```php
'providers' => [
    // ... other providers
    App\Providers\RepositoryServiceProvider::class,
]
```

---

## Data Synchronization Strategy

### Admin Updates (Automatic Availability to Students)

When admin updates data in `smart_lib_admin`:

1. **Books Updated** → Automatically visible to students on next request
   - No sync needed; students query directly from admin DB
   - Real-time availability

2. **Academic Calendar Updated** → Automatically visible to students
   - Real-time; students query directly from admin DB

3. **Student Approvals** → Update in `smart_lib` (student DB)
   - Approve action updates `users.is_approved` in student DB
   - Sync via API call from admin system to student system

### Student Updates (Student DB Only)

Students can only modify:
- Their own profile (name, email, phone, photo)
- Profile stored in `smart_lib` database
- No write access to admin database

---

## Controller Implementation Example

### BookController (Student-Facing)

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\AdminDataRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function __construct(private AdminDataRepository $adminData)
    {}

    public function index(Request $request)
    {
        // Read from admin database
        $books = $this->adminData->getAllBooks();
        
        return Inertia::render('Books/Index', ['books' => $books]);
    }

    public function show($bookId)
    {
        // Read from admin database
        $book = $this->adminData->getBook($bookId);
        
        return Inertia::render('Books/Show', ['book' => $book]);
    }

    public function search(Request $request)
    {
        // Read from admin database
        $books = $this->adminData->searchBooks($request->input('q'));
        
        return response()->json($books);
    }

    public function scanBarcode(Request $request)
    {
        // Read from admin database
        $book = $this->adminData->getBookByBarcode($request->input('barcode'));
        
        return response()->json($book);
    }
}
```

### ProfileController (Student DB)

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\StudentDataRepository;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private StudentDataRepository $studentData)
    {}

    public function edit(Request $request)
    {
        // Read from student database
        $profile = $this->studentData->getStudentProfile($request->user()->id);
        
        return Inertia::render('Profile/Edit', ['user' => $profile]);
    }

    public function update(Request $request)
    {
        // Write to student database
        $validated = $request->validate([
            'name' => 'string|max:255',
            'phone' => 'string|nullable',
            'photo' => 'image|nullable',
        ]);

        $this->studentData->updateStudentProfile($request->user()->id, $validated);
        
        return back()->with('status', 'Profile updated successfully');
    }
}
```

---

## API Endpoints (Student-Facing)

All authenticated endpoints read from appropriate databases:

### Books API (Read-Only from Admin DB)
```
GET  /api/books                 → Get all books
GET  /api/books/{id}            → Get book details
GET  /api/books/search?q=term   → Search books
POST /api/books/scan-barcode    → Scan book barcode
```

### Library Card API (Student DB)
```
GET  /api/library-card          → Get library card
POST /api/library-card/download → Download card
```

### Loans API (Student DB)
```
GET  /api/loans                 → Get active loans
GET  /api/loans/history         → Get loan history
```

### Academic Calendar API (Read-Only from Admin DB)
```
GET  /api/academic-calendar     → Get calendar events
POST /api/academic-calendar/download → Download calendar
```

### Notifications API (Student DB)
```
GET  /api/notifications         → Get unread notifications
GET  /api/notifications/history → Get all notifications
```

---

## Security & Access Control

### 1. **Read-Only Access to Admin Data**

Models using `mysql_admin` connection are read-only:
- Use repository methods for queries
- No `create()`, `update()`, `delete()` operations for students

### 2. **Authentication Middleware**

All routes require `auth:sanctum` or `auth,verified`:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Student can access these
});
```

### 3. **Authorization**

Students can only access their own data:

```php
// In StudentDataRepository
public function getStudentProfile($userId)
{
    return User::find($userId);  // Only own user can access
}

// In Controller
$this->studentData->getStudentProfile(auth()->id());  // Use authenticated user ID
```

---

## Admin-Side Implementation

### Admin Database Operations

Admins can read/write both databases:

1. **Student Data** (`smart_lib` database):
   - View all students
   - Approve registrations
   - Update student info
   - Delete accounts

2. **Admin Data** (`smart_lib_admin` database):
   - Create/update/delete books
   - Manage academic calendar
   - Manage categories
   - View reports

### Example Admin Endpoints

```
GET    /admin/students           → List all students
POST   /admin/students/{id}/approve → Approve student
GET    /admin/books              → List books (admin DB)
POST   /admin/books              → Create book
PATCH  /admin/books/{id}         → Update book
DELETE /admin/books/{id}         → Delete book
GET    /admin/academic-calendar  → List events
POST   /admin/academic-calendar  → Create event
```

---

## Data Sync Workflow

### Approval Workflow

```
1. Student registers (smart_lib):
   - User created with is_approved = false

2. Admin approves (smart_lib_admin):
   - Admin views pending students
   - Clicks "Approve"

3. Sync to Student DB:
   - API call from admin system to student system
   - Updates users.is_approved = true

4. Student sees updated status:
   - Next login shows approved status
   - Can access library features
```

### Book Update Workflow

```
1. Admin updates book (smart_lib_admin):
   - Updates title, availability, etc.
   - Changes immediately visible

2. Student sees changes:
   - Queries AdminBook model
   - Gets updated data on next request
   - No caching issues

3. Real-time availability:
   - When book is issued/returned in student DB (smart_lib)
   - Does NOT update admin DB (one-way read)
   - Admin DB is source of truth
```

---

## Best Practices

### 1. **Use Repositories**
✅ Always use repository methods for data access
```php
$books = $this->adminData->getAvailableBooks();
```

❌ Avoid direct model queries
```php
$books = AdminBook::all();  // Less maintainable
```

### 2. **Query Optimization**
- Use pagination for large datasets
- Load relationships when needed with `with()`
- Use scopes for common filters

### 3. **Error Handling**
```php
$book = $this->adminData->getBook($bookId);
if (!$book) {
    return response()->json(['error' => 'Book not found'], 404);
}
```

### 4. **Logging**
Log all database operations for auditing:
```php
\Log::info('Student ' . auth()->id() . ' viewed book ' . $bookId);
```

---

## Migration & Setup

### 1. **Create Admin Database**
```sql
CREATE DATABASE smart_lib_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. **Run Migrations**
```bash
# Student DB migrations
php artisan migrate

# Admin DB migrations (run on admin project)
php artisan migrate --database=mysql_admin
```

### 3. **Environment Setup**
```bash
# Update .env with both database credentials
DB_DATABASE=smart_lib
ADMIN_DB_DATABASE=smart_lib_admin
ADMIN_DB_HOST=your_host
ADMIN_DB_USERNAME=your_user
ADMIN_DB_PASSWORD=your_password
```

---

## Troubleshooting

### Issue: Models querying wrong database

**Solution**: Check the `$connection` property:
```php
// AdminBook should have:
protected $connection = 'mysql_admin';

// Other models default to 'mysql'
protected $connection = 'mysql';
```

### Issue: Access denied error

**Solution**: Verify database credentials in `.env`:
```bash
# Check ADMIN_DB_* variables match your setup
mysql -h 127.0.0.1 -u root smart_lib_admin
```

### Issue: Students can write to admin database

**Solution**: Never use `create()`, `update()`, `delete()` on admin models:
```php
// ❌ WRONG - Students could bypass this
AdminBook::create([...]);

// ✅ CORRECT - Only admins have access
// Use repositories for students
$this->adminData->getBook($id);
```

---

## Summary

| Aspect | Student | Admin |
|--------|---------|-------|
| **Student DB** | Read/Write own data | Read/Write all data |
| **Admin DB** | Read-only | Read/Write |
| **Books** | View (read-only) | CRUD |
| **Calendar** | View (read-only) | CRUD |
| **Profile** | Read/Write own | Read/Write all |
| **Approvals** | View status | Can approve |

This architecture ensures:
- ✅ Real-time data visibility to students
- ✅ Admin control over book/calendar data
- ✅ Student privacy with own profile isolation
- ✅ Zero write conflicts between databases
- ✅ Easy to scale (separate database servers possible)
