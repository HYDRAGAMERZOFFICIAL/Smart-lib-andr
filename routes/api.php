<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\LibraryCardController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\NotificationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Book Browsing API (read-only)
    Route::get('books', [BookController::class, 'index']);
    Route::get('books/{book}', [BookController::class, 'show']);
    Route::get('books/search', [BookController::class, 'search']);
    Route::post('books/scan-barcode', [BookController::class, 'scanBarcode']);

    // Library Card API (student only)
    Route::get('library-card', [LibraryCardController::class, 'show']);
    Route::post('library-card/download', [LibraryCardController::class, 'download']);

    // Loan Management API (student view only)
    Route::get('loans', [LoanController::class, 'index']);
    Route::get('loans/history', [LoanController::class, 'history']);

    // Fine Management API (student view only)
    Route::get('fines', [FineController::class, 'index']);
    Route::get('fines/{fine}', [FineController::class, 'show']);
    Route::get('fines/history', [FineController::class, 'history']);

    // Academic Calendar API (read-only)
    Route::get('academic-calendar', [AcademicCalendarController::class, 'index']);
    Route::post('academic-calendar/download', [AcademicCalendarController::class, 'download']);

    // Notifications API (student view only)
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/history', [NotificationController::class, 'history']);
});
