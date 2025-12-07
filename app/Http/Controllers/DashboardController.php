<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $activeLoans = Loan::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['bookCopy.book'])
            ->latest()
            ->get();

        $dueSoonCount = Loan::where('user_id', $user->id)
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays(3)])
            ->count();

        $overdueCount = Loan::where('user_id', $user->id)
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->count();

        $suggestedBooks = Book::where('available_copies', '>', 0)
            ->where('course', $user->student?->course)
            ->limit(6)
            ->get();

        $announcements = Notification::where('user_id', $user->id)
            ->where('type', 'announcement')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

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
