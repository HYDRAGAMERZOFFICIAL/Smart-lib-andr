# Implementation Guide - Dual Database Integration

This guide shows how to implement the dual database architecture in your application.

---

## Step 1: Configure Environment Variables

Update your `.env` file:

```env
# Student Database (smart_lib)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_lib
DB_USERNAME=root
DB_PASSWORD=

# Admin Database (smart_lib_admin)
ADMIN_DB_CONNECTION=mysql_admin
ADMIN_DB_HOST=127.0.0.1
ADMIN_DB_PORT=3306
ADMIN_DB_DATABASE=smart_lib_admin
ADMIN_DB_USERNAME=root
ADMIN_DB_PASSWORD=
```

---

## Step 2: Register Service Provider

The RepositoryServiceProvider is already registered in `config/app.php`:

```php
App\Providers\RepositoryServiceProvider::class,
```

---

## Step 3: Update Controllers to Use Repositories

### Example 1: BookController

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
        $query = $request->input('q');
        $category = $request->input('category');
        $course = $request->input('course');
        $semester = $request->input('semester');
        $availableOnly = $request->input('available_only');

        if ($query) {
            $books = $this->adminData->searchBooks($query);
        } elseif ($category) {
            $books = $this->adminData->getBooksByCategory($category);
        } elseif ($course) {
            $books = $this->adminData->getBooksByCourse($course, $semester);
        } elseif ($availableOnly) {
            $books = $this->adminData->getAvailableBooks();
        } else {
            $books = $this->adminData->getAllBooks();
        }

        return Inertia::render('Books/Index', [
            'books' => $books,
        ]);
    }

    public function show($bookId)
    {
        $book = $this->adminData->getBook($bookId);

        if (!$book) {
            abort(404, 'Book not found');
        }

        return Inertia::render('Books/Show', [
            'book' => $book,
            'available_copies' => $book->available_copies,
            'total_copies' => $book->total_copies,
        ]);
    }

    public function search(Request $request)
    {
        $books = $this->adminData->searchBooks($request->input('q'));
        return response()->json($books);
    }

    public function scanBarcode(Request $request)
    {
        $barcode = $request->input('barcode');
        $book = $this->adminData->getBookByBarcode($barcode);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'isbn' => $book->isbn,
            'publisher' => $book->publisher,
            'available_copies' => $book->available_copies,
            'total_copies' => $book->total_copies,
        ]);
    }
}
```

### Example 2: DashboardController

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\StudentDataRepository;
use App\Repositories\AdminDataRepository;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct(
        private StudentDataRepository $studentData,
        private AdminDataRepository $adminData
    )
    {}

    public function index()
    {
        $user = Auth::user();

        // Get data from student database
        $activeLoans = $this->studentData->getActiveLoans($user->id);
        $dueSoonCount = $this->studentData->countDueSoon($user->id);
        $overdueCount = $this->studentData->countOverdue($user->id);

        // Get suggestions from admin database
        $suggestedBooks = $this->adminData->getAllBooks(false);

        // Get announcements from student database
        // (Notifications sent to this student)
        $announcements = $this->studentData->getNotifications($user->id, false);

        return inertia('Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'activeLoans' => $activeLoans,
            'activeLoanCount' => $activeLoans->count(),
            'dueSoonCount' => $dueSoonCount,
            'overdueCount' => $overdueCount,
            'suggestedBooks' => $suggestedBooks,
            'announcements' => $announcements,
        ]);
    }
}
```

### Example 3: LoanController

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\StudentDataRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function __construct(private StudentDataRepository $studentData)
    {}

    public function index(Request $request)
    {
        $user = auth()->user();

        $loans = $this->studentData->getActiveLoans($user->id);
        $dueSoonCount = $this->studentData->countDueSoon($user->id);
        $overdueCount = $this->studentData->countOverdue($user->id);

        return Inertia::render('Loans/Index', [
            'loans' => $loans,
            'dueSoonCount' => $dueSoonCount,
            'overdueCount' => $overdueCount,
        ]);
    }

    public function history()
    {
        $user = auth()->user();
        $loans = $this->studentData->getLoanHistory($user->id);

        return Inertia::render('Loans/History', ['loans' => $loans]);
    }
}
```

### Example 4: AcademicCalendarController

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\AdminDataRepository;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    public function __construct(private AdminDataRepository $adminData)
    {}

    public function index()
    {
        $events = $this->adminData->getAllAcademicEvents(false);

        return Inertia::render('AcademicCalendar/Index', ['events' => $events]);
    }

    public function download()
    {
        $pdfPath = storage_path('academic-calendars/calendar.pdf');

        if (!file_exists($pdfPath)) {
            return back()->with('error', 'Calendar PDF not available');
        }

        return response()->download($pdfPath, 'academic-calendar.pdf');
    }
}
```

### Example 5: NotificationController

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\StudentDataRepository;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct(private StudentDataRepository $studentData)
    {}

    public function index()
    {
        $user = auth()->user();
        $notifications = $this->studentData->getNotifications($user->id);

        return Inertia::render('Notifications/Index', ['notifications' => $notifications]);
    }

    public function history()
    {
        $user = auth()->user();
        $notifications = $this->studentData->getNotificationHistory($user->id);

        return Inertia::render('Notifications/History', ['notifications' => $notifications]);
    }
}
```

### Example 6: ProfileController

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\StudentDataRepository;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private StudentDataRepository $studentData)
    {}

    public function edit()
    {
        $user = auth()->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
        $user = auth()->user();
        $validated = $request->validated();

        // Handle photo upload
        if ($request->hasFile('photo')) {
            if ($user->photo && file_exists(storage_path('app/public/' . $user->photo))) {
                unlink(storage_path('app/public/' . $user->photo));
            }
            $validated['photo'] = $request->file('photo')->store('profile-photos', 'public');
        }

        $this->studentData->updateStudentProfile($user->id, $validated);

        return back()->with('status', 'Profile updated successfully');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = auth()->user();
        auth()->logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
```

---

## Step 4: Create Admin-Side Controllers

For the admin system, create controllers that access both databases:

### AdminBookController (for smart_lib_admin)

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\AdminBook;
use Illuminate\Http\Request;

class AdminBookController extends Controller
{
    public function index()
    {
        $books = AdminBook::paginate(20);
        return view('admin.books.index', ['books' => $books]);
    }

    public function create()
    {
        return view('admin.books.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:smart_lib_admin.books',
            'category' => 'required|string',
            'publisher' => 'nullable|string',
            'edition' => 'nullable|string',
            'total_copies' => 'required|integer|min:1',
        ]);

        AdminBook::create($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book created successfully');
    }

    public function edit(AdminBook $book)
    {
        return view('admin.books.edit', ['book' => $book]);
    }

    public function update(Request $request, AdminBook $book)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'isbn' => 'string|unique:smart_lib_admin.books,isbn,' . $book->id,
            'category' => 'string',
            'available_copies' => 'integer|min:0',
        ]);

        $book->update($validated);

        return back()->with('success', 'Book updated successfully');
    }

    public function destroy(AdminBook $book)
    {
        $book->delete();
        return back()->with('success', 'Book deleted successfully');
    }
}
```

### AdminStudentController (for smart_lib - accessing student data)

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;

class AdminStudentController extends Controller
{
    public function index()
    {
        // Access smart_lib database (default connection)
        $students = User::where('is_approved', false)->paginate(20);
        return view('admin.students.index', ['students' => $students]);
    }

    public function approve(User $student)
    {
        $student->update(['is_approved' => true]);
        
        // Optionally send notification
        // $student->notify(new RegistrationApproved());

        return back()->with('success', 'Student approved successfully');
    }

    public function show(User $student)
    {
        // Get student data from smart_lib
        return view('admin.students.show', ['student' => $student]);
    }

    public function edit(User $student)
    {
        return view('admin.students.edit', ['student' => $student]);
    }

    public function update(Request $request, User $student)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $student->id,
            'phone' => 'nullable|string',
        ]);

        $student->update($validated);

        return back()->with('success', 'Student updated successfully');
    }

    public function destroy(User $student)
    {
        $student->delete();
        return back()->with('success', 'Student deleted successfully');
    }
}
```

---

## Step 5: API Routes Configuration

### Student Routes (routes/api.php)

```php
Route::middleware('auth:sanctum')->group(function () {
    // Books - READ ONLY from admin database
    Route::get('books', [BookController::class, 'index']);
    Route::get('books/{book}', [BookController::class, 'show']);
    Route::get('books/search', [BookController::class, 'search']);
    Route::post('books/scan-barcode', [BookController::class, 'scanBarcode']);

    // Loans - READ/WRITE on student database
    Route::get('loans', [LoanController::class, 'index']);
    Route::get('loans/history', [LoanController::class, 'history']);

    // Library Card - READ on student database
    Route::get('library-card', [LibraryCardController::class, 'show']);
    Route::post('library-card/download', [LibraryCardController::class, 'download']);

    // Academic Calendar - READ ONLY from admin database
    Route::get('academic-calendar', [AcademicCalendarController::class, 'index']);
    Route::post('academic-calendar/download', [AcademicCalendarController::class, 'download']);

    // Notifications - READ on student database
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/history', [NotificationController::class, 'history']);
});
```

### Admin Routes (routes/web.php or routes/admin.php)

```php
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Students - CRUD on smart_lib database
    Route::resource('students', AdminStudentController::class);
    Route::post('students/{student}/approve', [AdminStudentController::class, 'approve']);

    // Books - CRUD on smart_lib_admin database
    Route::resource('books', AdminBookController::class);

    // Academic Calendar - CRUD on smart_lib_admin database
    Route::resource('academic-calendar', AdminAcademicCalendarController::class);
});
```

---

## Step 6: Testing the Dual Database Setup

### Test 1: Verify Student Can Read from Admin DB

```php
// Test student seeing books from admin database
Route::get('/test/admin-books', function () {
    return \App\Models\AdminBook::all();
});

// Expected: Returns books from smart_lib_admin
```

### Test 2: Verify Student Data Isolation

```php
// Test student can only see own profile
Route::get('/test/profile', function () {
    $user = auth()->user();
    return User::find($user->id);  // From smart_lib
});

// Expected: Only current user's profile
```

### Test 3: Verify Admin Can Access Both

```php
// Admin can query both databases
$students = User::all();  // smart_lib
$books = AdminBook::all();  // smart_lib_admin
```

---

## Step 7: Database Synchronization

### Trigger: When Admin Approves Student

```php
// AdminStudentController
public function approve(User $student)
{
    $student->update(['is_approved' => true]);
    
    // Log the approval
    \Log::info('Student ' . $student->id . ' approved by admin');
    
    // Notify student
    // $student->notify(new RegistrationApproved());
    
    return back()->with('success', 'Student approved');
}
```

### Real-time Book Availability Updates

When admin updates book availability:
```php
// AdminBookController
public function update(Request $request, AdminBook $book)
{
    $book->update([
        'available_copies' => $request->input('available_copies'),
    ]);
    
    // Students see updated availability immediately
    return back()->with('success', 'Book updated');
}
```

---

## Troubleshooting Checklist

- [ ] Both databases exist and are accessible
- [ ] `.env` has both `DB_*` and `ADMIN_DB_*` variables
- [ ] `config/database.php` has both connections defined
- [ ] `RepositoryServiceProvider` is registered in `config/app.php`
- [ ] Controllers use dependency injection for repositories
- [ ] Models have correct `$connection` property
- [ ] Database credentials are correct for both databases
- [ ] Migrations have been run for both databases

---

## Summary

The dual database architecture provides:

✅ **Real-time data visibility**: Students see admin updates immediately  
✅ **Data consistency**: Single source of truth for books/calendar  
✅ **Security**: Students can't modify admin data  
✅ **Scalability**: Can run admin and student on separate servers  
✅ **Maintainability**: Repositories abstract database logic  

For questions or issues, refer to `DUAL_DATABASE_ARCHITECTURE.md`.
