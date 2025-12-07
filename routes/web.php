<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\LibraryCardController;
use App\Http\Controllers\IssueReturnController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LibraryReportController;
use App\Http\Controllers\TwoFactorAuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified', '2fa'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Student Management Routes
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::post('/students/{student}/approve', [StudentController::class, 'approve'])->name('students.approve');
    Route::post('/students/{student}/reject', [StudentController::class, 'reject'])->name('students.reject');
    Route::post('/students/{student}/block', [StudentController::class, 'block'])->name('students.block');
    Route::post('/students/{student}/unblock', [StudentController::class, 'unblock'])->name('students.unblock');
    Route::post('/students/{student}/reset-password', [StudentController::class, 'resetPassword'])->name('students.reset-password');
    
    // Library Card Routes
    Route::get('/library-cards', [LibraryCardController::class, 'index'])->name('library-cards.index');
    Route::post('/library-cards/{student}/generate', [LibraryCardController::class, 'generate'])->name('library-cards.generate');
    Route::post('/library-cards/{card}/reissue', [LibraryCardController::class, 'reissue'])->name('library-cards.reissue');
    Route::get('/library-cards/{card}/print', [LibraryCardController::class, 'print'])->name('library-cards.print');
    
    // Book Management Routes
    Route::resource('books', BookController::class);
    Route::get('/books/search', [BookController::class, 'search'])->name('books.search');
    
    // Book Copies Routes
    Route::get('/book-copies', [BookCopyController::class, 'index'])->name('book-copies.index');
    Route::post('/book-copies', [BookCopyController::class, 'store'])->name('book-copies.store');
    Route::post('/book-copies/bulk', [BookCopyController::class, 'storeBulk'])->name('book-copies.bulk');
    Route::patch('/book-copies/{copy}', [BookCopyController::class, 'updateStatus'])->name('book-copies.update-status');
    Route::get('/book-copies/print-barcodes', [BookCopyController::class, 'printBarcodes'])->name('book-copies.print-barcodes');
    
    // Issue & Return Routes
    Route::get('/issue-return', [IssueReturnController::class, 'index'])->name('issue-return.index');
    Route::post('/issue-return/issue', [IssueReturnController::class, 'issue'])->name('issue-return.issue');
    Route::post('/issue-return/return', [IssueReturnController::class, 'return'])->name('issue-return.return');
    Route::post('/issue-return/validate', [IssueReturnController::class, 'validate'])->name('issue-return.validate');
    
    // Loan Tracking Routes
    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    Route::get('/loans/due-soon', [LoanController::class, 'dueSoon'])->name('loans.due-soon');
    Route::get('/loans/overdue', [LoanController::class, 'overdue'])->name('loans.overdue');
    Route::post('/loans/send-reminder', [LoanController::class, 'sendReminder'])->name('loans.send-reminder');
    Route::post('/loans/{loan}/waive-fine', [LoanController::class, 'waiveFine'])->name('loans.waive-fine');
    
    // Academic Calendar Routes
    Route::resource('academic-calendar', AcademicCalendarController::class);
    Route::post('/academic-calendar/upload-pdf', [AcademicCalendarController::class, 'uploadPdf'])->name('academic-calendar.upload-pdf');
    
    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/send', [NotificationController::class, 'send'])->name('notifications.send');
    Route::get('/notifications/history', [NotificationController::class, 'history'])->name('notifications.history');
    
    // Reports Routes
    Route::get('/reports', [LibraryReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/issued-books', [LibraryReportController::class, 'issuedBooks'])->name('reports.issued-books');
    Route::get('/reports/returned-books', [LibraryReportController::class, 'returnedBooks'])->name('reports.returned-books');
    Route::get('/reports/overdue', [LibraryReportController::class, 'overdueReport'])->name('reports.overdue');
    Route::get('/reports/student-wise', [LibraryReportController::class, 'studentWise'])->name('reports.student-wise');
    Route::get('/reports/book-wise', [LibraryReportController::class, 'bookWise'])->name('reports.book-wise');
    Route::get('/reports/fine-collection', [LibraryReportController::class, 'fineCollection'])->name('reports.fine-collection');
    Route::post('/reports/export', [LibraryReportController::class, 'export'])->name('reports.export');
});

Route::middleware(['auth', '2fa'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // 2FA Setup Routes
    Route::get('/two-factor/setup', [TwoFactorAuthController::class, 'setup'])->name('two-factor.setup');
    Route::post('/two-factor/enable', [TwoFactorAuthController::class, 'enable'])->name('two-factor.enable');
    Route::post('/two-factor/disable', [TwoFactorAuthController::class, 'disable'])->name('two-factor.disable');
});

// 2FA Verification Routes (auth but not 2fa)
Route::middleware('auth')->group(function () {
    Route::get('/two-factor/verify', [TwoFactorAuthController::class, 'verify'])->name('two-factor.verify');
    Route::post('/two-factor/validate', [TwoFactorAuthController::class, 'validateCode'])->name('two-factor.validate');
    Route::post('/two-factor/recovery', [TwoFactorAuthController::class, 'useRecoveryCode'])->name('two-factor.recovery');
    
    // Impersonation stop route
    Route::post('/stop-impersonating', [App\Http\Controllers\Admin\UserController::class, 'stopImpersonating'])->name('stop.impersonating');
});

// Admin Routes (Super Admin & Library Admin)
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    // Admin User Management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    Route::post('/users/create', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::post('/users/update-role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.update-role');
    Route::post('/users/update', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('/users/{user}/impersonate', [App\Http\Controllers\Admin\UserController::class, 'impersonate'])->name('admin.users.impersonate');
    
    // Global Settings
    Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('admin.settings.update');
    
    // Audit Logs
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('admin.audit-logs');
    
    // Admin Reports
    Route::get('/reports', [AdminReportController::class, 'index'])->name('admin.reports');
});

require __DIR__.'/auth.php';
