<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BooksController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/books', [BooksController::class, 'index'])->name('books.index');
    Route::get('/books/{book}', [BooksController::class, 'show'])->name('books.show');
    
    Route::get('/loans', fn() => inertia('Loans'))->name('loans');
    Route::get('/card', fn() => inertia('Card'))->name('card');
    Route::get('/calendar', fn() => inertia('Calendar'))->name('calendar');
    Route::get('/notifications', fn() => inertia('Notifications'))->name('notifications');
    Route::get('/profile', fn() => inertia('Profile'))->name('profile');
    Route::put('/profile', function () {
        return back()->with('message', 'Profile updated successfully');
    })->name('profile.update');
});

Route::redirect('/', '/dashboard');
