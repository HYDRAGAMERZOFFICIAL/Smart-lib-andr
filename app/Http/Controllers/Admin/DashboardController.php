<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Book;
use App\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('isAdmin');

        $userFilter = $request->input('user_id');
        $dateFrom = $request->input('date_from') ? Carbon::parse($request->input('date_from')) : Carbon::now()->startOfMonth();
        $dateTo = $request->input('date_to') ? Carbon::parse($request->input('date_to'))->endOfDay() : Carbon::now()->endOfMonth();

        $query = User::where('role', 'member');
        
        if ($userFilter) {
            $query->where('id', $userFilter);
        }

        $users = $query->with([
            'issuedLoans' => function($q) use ($dateFrom, $dateTo) {
                $q->whereBetween('issued_date', [$dateFrom, $dateTo]);
            }
        ])->get();

        $totalStudents = Student::count();
        $totalBooks = Book::count();
        $totalLoans = Loan::whereBetween('issued_date', [$dateFrom, $dateTo])->count();
        $overdueLoans = Loan::where('due_date', '<', now())->where('status', 'active')->count();
        $totalFines = Loan::whereBetween('issued_date', [$dateFrom, $dateTo])->sum('fine_amount');

        $allUsers = User::where('role', 'member')->get(['id', 'name', 'email']);

        $loansData = Loan::with('student', 'bookCopy.book', 'issuedByUser')
            ->whereBetween('issued_date', [$dateFrom, $dateTo])
            ->when($userFilter, function($q) use ($userFilter) {
                $q->where('issued_by_id', $userFilter);
            })
            ->orderBy('issued_date', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalBooks' => $totalBooks,
                'totalLoans' => $totalLoans,
                'overdueLoans' => $overdueLoans,
                'totalFines' => $totalFines,
            ],
            'loans' => $loansData,
            'users' => $allUsers,
            'filters' => [
                'user_id' => $userFilter,
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
            ],
        ]);
    }
}
