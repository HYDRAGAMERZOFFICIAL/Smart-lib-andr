<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Book;
use App\Models\Loan;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : Carbon::now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date'))->endOfDay() : Carbon::now()->endOfMonth()->endOfDay();

        if ($endDate->lt($startDate)) {
            $endDate = (clone $startDate)->lastOfMonth();
        }

        $dateRange = [
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d')
        ];

        $totalStudents = Student::where('created_by', $user->id)->count();
        $pendingApprovals = Student::where('created_by', $user->id)->where('status', 'pending')->count();
        $totalBooks = Book::count();
        $totalBookCopies = BookCopy::count();
        
        $booksIssuedToday = Loan::where('issued_by_id', $user->id)
            ->whereDate('issued_date', today())
            ->count();

        $dueSoon = Loan::where('issued_by_id', $user->id)
            ->where('due_date', '>', now())
            ->where('due_date', '<=', now()->addDays(3))
            ->where('status', 'active')
            ->count();

        $overdue = Loan::where('issued_by_id', $user->id)
            ->where('due_date', '<', now())
            ->where('status', 'active')
            ->count();

        $userLoans = Loan::where('issued_by_id', $user->id)
            ->with('student', 'bookCopy.book')
            ->whereBetween('issued_date', [$startDate, $endDate])
            ->orderBy('issued_date', 'desc')
            ->paginate(10)
            ->withQueryString();

        return inertia('Dashboard', [
            'totalStudents' => $totalStudents,
            'pendingApprovals' => $pendingApprovals,
            'totalBooks' => $totalBooks,
            'totalBookCopies' => $totalBookCopies,
            'booksIssuedToday' => $booksIssuedToday,
            'dueSoon' => $dueSoon,
            'overdue' => $overdue,
            'userLoans' => $userLoans,
            'dateRange' => $dateRange,
        ]);
    }
}
