<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\LibraryCardController;
use App\Http\Controllers\IssueReturnController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StudentDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Student Dashboard and Profile Routes
    Route::get('/student/dashboard', [StudentDashboardController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/student/profile', [StudentDashboardController::class, 'profile'])->name('student.profile');
    Route::get('/student/profile/edit', [StudentDashboardController::class, 'edit'])->name('student.profile.edit');
    Route::patch('/student/profile', [StudentDashboardController::class, 'update'])->name('student.profile.update');
    
    // Library Card Routes
    Route::get('/library-card', [LibraryCardController::class, 'show'])->name('library-card.show');
    Route::post('/library-card/download', [LibraryCardController::class, 'download'])->name('library-card.download');
    Route::post('/library-card/request', [LibraryCardController::class, 'request'])->name('library-card.request');
    
    // Book Management Routes (Student read-only)
    Route::get('/books', [BookController::class, 'index'])->name('books.index');
    Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');
    Route::get('/books/search', [BookController::class, 'search'])->name('books.search');
    
    // Book Barcode Scanning
    Route::post('/books/scan-barcode', [BookController::class, 'scanBarcode'])->name('books.scan-barcode');
    
    // Loan Management Routes (Student view only)
    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    Route::get('/loans/history', [LoanController::class, 'history'])->name('loans.history');
    
    // Fine Management Routes (Student view only)
    Route::get('/fines', [FineController::class, 'index'])->name('fines.index');
    Route::get('/fines/{fine}', [FineController::class, 'show'])->name('fines.show');
    Route::get('/fines/history', [FineController::class, 'history'])->name('fines.history');
    
    // Academic Calendar Routes (read-only)
    Route::get('/academic-calendar', [AcademicCalendarController::class, 'index'])->name('academic-calendar.index');
    Route::post('/academic-calendar/download', [AcademicCalendarController::class, 'download'])->name('academic-calendar.download');
    
    // Notification Routes (Student view only)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/history', [NotificationController::class, 'history'])->name('notifications.history');
});

require __DIR__.'/auth.php';
