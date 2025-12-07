<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\IssuedBook;

class LoansController extends Controller
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

        $loans = IssuedBook::where('user_id', $user->id)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($loan) {
                return [
                    'id' => $loan->id,
                    'user_id' => $loan->user_id,
                    'book_id' => $loan->book_id,
                    'book' => $loan->book ? [
                        'id' => $loan->book->id,
                        'title' => $loan->book->title,
                        'author' => $loan->book->author,
                        'isbn' => $loan->book->isbn,
                    ] : null,
                    'issued_date' => $loan->issued_date,
                    'due_date' => $loan->due_date,
                    'returned_date' => $loan->returned_date,
                    'status' => $loan->status,
                    'fine' => $loan->fine,
                ];
            });

        $activeLoanCount = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->count();

        $overdueLoanCount = IssuedBook::where('user_id', $user->id)
            ->where('status', 'issued')
            ->where('due_date', '<', now())
            ->count();

        $totalOutstandingFines = IssuedBook::where('user_id', $user->id)
            ->whereNotNull('fine')
            ->sum('fine') ?? 0;

        return Inertia::render('Loans', [
            'loans' => $loans,
            'stats' => [
                'activeLoanCount' => $activeLoanCount,
                'overdueLoanCount' => $overdueLoanCount,
                'totalOutstandingFines' => number_format($totalOutstandingFines, 2),
            ]
        ]);
    }
}
