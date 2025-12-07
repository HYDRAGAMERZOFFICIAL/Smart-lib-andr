<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\IssuedBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $activeLoans = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->count();

        $overdueBooks = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->where('due_date', '<', now())
            ->count();

        $totalFines = IssuedBook::where('user_id', $user->id)
            ->whereNotNull('fine')
            ->sum('fine');

        $recentBooks = Book::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'activeLoans' => $activeLoans,
                'overdueBooks' => $overdueBooks,
                'totalFines' => $totalFines,
                'recentBooks' => $recentBooks,
            ],
        ]);
    }
}
