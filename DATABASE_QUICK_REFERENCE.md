# Database Quick Reference

## Connection Summary

| Database | Connection Name | Purpose | Users |
|----------|-----------------|---------|-------|
| `smart_lib` | `mysql` (default) | Student data (users, loans, cards, notifications) | Students + Admin |
| `smart_lib_admin` | `mysql_admin` | Admin data (books, calendar, reports) | Admin only |

---

## Models & Their Connections

### Student Database Models (`mysql` - default)

```php
// User data
User::class                    // Uses default 'mysql' connection

// Student-specific data
Loan::class                    // Uses default 'mysql' connection
LibraryCard::class             // Uses default 'mysql' connection
Notification::class            // Uses default 'mysql' connection
```

### Admin Database Models (`mysql_admin`)

```php
// Admin-only data (read-only for students)
AdminBook::class               // Uses 'mysql_admin' connection
AdminAcademicCalendarEvent::class  // Uses 'mysql_admin' connection
```

---

## Repository Methods Quick Reference

### AdminDataRepository (Read-Only for Students)

```php
// Get Books
$adminData->getAllBooks($paginate = true, $perPage = 20)
$adminData->getAvailableBooks($paginate = true, $perPage = 20)
$adminData->getBooksByCategory($category, $paginate = true, $perPage = 20)
$adminData->getBooksByCourse($course, $semester = null, $paginate = true, $perPage = 20)
$adminData->searchBooks($searchTerm, $paginate = true, $perPage = 20)
$adminData->getBook($bookId)
$adminData->getBookByBarcode($barcode)

// Get Academic Calendar
$adminData->getAllAcademicEvents($paginate = true, $perPage = 20)
$adminData->getUpcomingAcademicEvents($limit = 10)
$adminData->getAcademicEventsByType($type)
$adminData->getAcademicEvent($eventId)
```

### StudentDataRepository (Read/Write for Students on Own Data)

```php
// Profile Management
$studentData->getStudentProfile($userId)
$studentData->updateStudentProfile($userId, $data)

// Loans
$studentData->getActiveLoans($userId)
$studentData->getLoanHistory($userId, $paginate = true, $perPage = 20)
$studentData->getLoansDueSoon($userId, $days = 3)
$studentData->getOverdueLoans($userId)
$studentData->countActiveLoans($userId)
$studentData->countDueSoon($userId, $days = 3)
$studentData->countOverdue($userId)

// Library Card
$studentData->getLibraryCard($userId)

// Notifications
$studentData->getNotifications($userId, $paginate = true, $perPage = 20)
$studentData->getNotificationHistory($userId, $paginate = true, $perPage = 20)
```

---

## Controller Examples

### Using Both Repositories

```php
<?php

class DashboardController extends Controller
{
    public function __construct(
        private StudentDataRepository $studentData,
        private AdminDataRepository $adminData
    )
    {}

    public function index()
    {
        $userId = auth()->id();

        // From student database
        $loans = $this->studentData->getActiveLoans($userId);
        
        // From admin database
        $books = $this->adminData->getAvailableBooks();

        return view('dashboard', [
            'loans' => $loans,
            'books' => $books,
        ]);
    }
}
```

---

## Data Access Patterns

### Pattern 1: Student Reading Admin Data

```php
// ✅ Correct
$book = AdminBook::find($bookId);  // Reads from smart_lib_admin

// Students CAN see this
$books = AdminBook::where('available_copies', '>', 0)->get();

// Students CANNOT do this
AdminBook::create([...]);  // Would fail
AdminBook::find($id)->update([...]);  // Would fail
```

### Pattern 2: Student Managing Own Data

```php
// ✅ Correct - Student updates own profile
User::find(auth()->id())->update(['phone' => '1234567890']);

// ❌ Wrong - Would be unauthorized
User::find($someOtherId)->update([...]);
```

### Pattern 3: Admin Managing Both

```php
// Admin can read/write both
$student = User::find($studentId);  // smart_lib
$student->update([...]);  // Update student

$book = AdminBook::find($bookId);  // smart_lib_admin
$book->update([...]);  // Update book

$calendar = AdminAcademicCalendarEvent::create([...]);  // Create event
```

---

## Common Queries

### Get All Books (for Students)

```php
// Method 1: Using Repository (RECOMMENDED)
$books = app(AdminDataRepository::class)->getAllBooks();

// Method 2: Direct Model Query
$books = AdminBook::where('is_archived', false)->paginate(20);
```

### Get Student's Active Loans

```php
// Method 1: Using Repository (RECOMMENDED)
$loans = app(StudentDataRepository::class)->getActiveLoans(auth()->id());

// Method 2: Direct Model Query
$loans = Loan::where('user_id', auth()->id())
    ->where('status', 'active')
    ->get();
```

### Search Books

```php
// Method 1: Using Repository
$results = $adminData->searchBooks('Harry Potter');

// Method 2: Direct Query
$results = AdminBook::where('title', 'like', '%Harry Potter%')
    ->orWhere('author', 'like', '%Harry Potter%')
    ->get();
```

### Get Calendar Events for This Month

```php
// Method 1: Using Repository
$events = $adminData->getUpcomingAcademicEvents(10);

// Method 2: Direct Query
$events = AdminAcademicCalendarEvent::where('is_published', true)
    ->where('start_date', '>=', now())
    ->orderBy('start_date')
    ->take(10)
    ->get();
```

---

## Environment Variables

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

---

## Database Tables

### smart_lib (Student Database)

```
users
├── id
├── name
├── email
├── phone
├── photo
├── password
├── is_approved
├── email_verified_at
└── timestamps

loans
├── id
├── user_id (FK → users.id)
├── book_id
├── book_copy_id
├── issued_date
├── due_date
├── returned_date
├── status
├── fine
└── timestamps

library_cards
├── id
├── user_id (FK → users.id)
├── card_number
├── barcode
├── qr_code
├── issued_date
├── expiry_date
├── status
└── timestamps

notifications
├── id
├── user_id (FK → users.id)
├── type
├── title
├── message
├── read_at
└── timestamps
```

### smart_lib_admin (Admin Database)

```
books
├── id
├── isbn
├── title
├── author
├── publisher
├── edition
├── category
├── description
├── cover_image
├── barcode
├── total_copies
├── available_copies
├── language
├── publication_year
├── rack
├── shelf
├── course
├── semester
├── is_archived
└── timestamps

academic_calendar_events
├── id
├── title
├── description
├── type (holiday/exam/library_closed/event)
├── start_date
├── end_date
├── start_time
├── end_time
├── location
├── is_published
├── created_by
└── timestamps
```

---

## Debugging Tips

### Check Which Database a Model Uses

```php
// Add to model
dd($model->getConnection()->getName());  // Returns 'mysql' or 'mysql_admin'
```

### Check Database Connection Configuration

```php
// In tinker or controller
dd(config('database.connections.mysql'));
dd(config('database.connections.mysql_admin'));
```

### Query Last Executed SQL

```php
// Enable query logging
\DB::enableQueryLog();

// Run your query
$books = AdminBook::all();

// Check the SQL
dd(\DB::getQueryLog());
```

### Test Connection

```php
try {
    DB::connection('mysql')->select(DB::raw("SELECT 1"));
    echo "Student DB connected";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}

try {
    DB::connection('mysql_admin')->select(DB::raw("SELECT 1"));
    echo "Admin DB connected";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

---

## Important Notes

1. **AdminBook** model is READ-ONLY for students
2. **AdminAcademicCalendarEvent** model is READ-ONLY for students
3. Students automatically see real-time updates from admin database
4. No caching needed for admin data (direct queries)
5. Use repositories for consistency and maintainability
6. Always check authorization before write operations
7. Log all administrative changes for audit trail

---

## Quick Setup Checklist

- [ ] Create both databases: `smart_lib` and `smart_lib_admin`
- [ ] Update `.env` with both database credentials
- [ ] Verify `config/database.php` has both connections
- [ ] Run migrations for both databases
- [ ] Verify `RepositoryServiceProvider` is registered
- [ ] Test connections with provided debugging tips
- [ ] Update all controllers to use repositories
- [ ] Test student can read from admin DB
- [ ] Test admin can read/write both DBs
- [ ] Test student cannot write to admin DB

---

For detailed implementation, see `IMPLEMENTATION_GUIDE.md`  
For architecture overview, see `DUAL_DATABASE_ARCHITECTURE.md`
