<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\IssuedBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        
        if (!$user || !$user->is_approved) {
            return redirect('/login');
        }
        
        $activeLoans = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->count();

        $overdueBooks = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->where('due_date', '<', now())
            ->count();

        $totalFines = IssuedBook::where('user_id', $user->id)
            ->whereNotNull('fine')
            ->sum('fine') ?? 0;

        $recentBooks = Book::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'activeLoans' => $activeLoans,
                'overdueBooks' => $overdueBooks,
                'totalFines' => number_format($totalFines, 2),
                'recentBooks' => $recentBooks->map(function ($book) {
                    return [
                        'id' => $book->id,
                        'title' => $book->title,
                        'author' => $book->author,
                        'availableCopies' => $book->available_copies,
                    ];
                }),
            ],
        ]);
    }
}
