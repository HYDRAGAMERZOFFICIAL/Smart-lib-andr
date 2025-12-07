<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\LibraryCardController;
use App\Http\Controllers\IssueReturnController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LibraryReportController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Student Management API
    Route::apiResource('students', StudentController::class);
    Route::post('students/{student}/approve', [StudentController::class, 'approve']);
    Route::post('students/{student}/reject', [StudentController::class, 'reject']);
    Route::post('students/{student}/block', [StudentController::class, 'block']);
    Route::post('students/{student}/unblock', [StudentController::class, 'unblock']);
    Route::post('students/{student}/reset-password', [StudentController::class, 'resetPassword']);

    // Book Management API
    Route::apiResource('books', BookController::class);
    Route::get('books/search', [BookController::class, 'search']);

    // Book Copies API
    Route::apiResource('book-copies', BookCopyController::class);
    Route::post('book-copies/bulk', [BookCopyController::class, 'storeBulk']);
    Route::patch('book-copies/{copy}/status', [BookCopyController::class, 'updateStatus']);
    Route::get('book-copies/print/barcodes', [BookCopyController::class, 'printBarcodes']);

    // Library Card API
    Route::get('library-cards', [LibraryCardController::class, 'index']);
    Route::post('library-cards/{student}/generate', [LibraryCardController::class, 'generate']);
    Route::post('library-cards/{card}/reissue', [LibraryCardController::class, 'reissue']);
    Route::get('library-cards/{card}/print', [LibraryCardController::class, 'print']);

    // Issue & Return API
    Route::get('issue-return', [IssueReturnController::class, 'index']);
    Route::post('issue-return/validate', [IssueReturnController::class, 'validate']);
    Route::post('issue-return/issue', [IssueReturnController::class, 'issue']);
    Route::post('issue-return/return', [IssueReturnController::class, 'return']);

    // Loan Management API
    Route::get('loans', [LoanController::class, 'index']);
    Route::get('loans/due-soon', [LoanController::class, 'dueSoon']);
    Route::get('loans/overdue', [LoanController::class, 'overdue']);
    Route::post('loans/send-reminder', [LoanController::class, 'sendReminder']);
    Route::post('loans/{loan}/waive-fine', [LoanController::class, 'waiveFine']);

    // Academic Calendar API
    Route::apiResource('academic-calendar', AcademicCalendarController::class);
    Route::post('academic-calendar/upload-pdf', [AcademicCalendarController::class, 'uploadPdf']);

    // Notifications API
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/send', [NotificationController::class, 'send']);
    Route::get('notifications/history', [NotificationController::class, 'history']);

    // Reports API
    Route::get('reports', [LibraryReportController::class, 'index']);
    Route::get('reports/issued-books', [LibraryReportController::class, 'issuedBooks']);
    Route::get('reports/returned-books', [LibraryReportController::class, 'returnedBooks']);
    Route::get('reports/overdue', [LibraryReportController::class, 'overdueReport']);
    Route::get('reports/student-wise', [LibraryReportController::class, 'studentWise']);
    Route::get('reports/book-wise', [LibraryReportController::class, 'bookWise']);
    Route::get('reports/fine-collection', [LibraryReportController::class, 'fineCollection']);
    Route::post('reports/export', [LibraryReportController::class, 'export']);
});
