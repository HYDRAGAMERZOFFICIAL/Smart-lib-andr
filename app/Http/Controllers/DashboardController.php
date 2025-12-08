<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Student;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $student = Student::where('email', $user->email)->first();

        if ($student) {
            return redirect()->route('student.dashboard');
        }

        return inertia('Dashboard', [
            'totalStudents' => Student::count(),
            'pendingApprovals' => Student::where('status', 'pending')->count(),
            'totalBooks' => Book::count(),
            'totalBookCopies' => 0,
            'booksIssuedToday' => 0,
            'dueSoon' => 0,
            'overdue' => Loan::where('status', 'active')->where('due_date', '<', now())->count(),
            'totalStaff' => 0,
            'fineCollected' => 0,
            'dailyIssuanceData' => [],
            'monthlyBorrowingData' => [],
            'categoryWiseData' => [],
            'departmentUsageData' => [],
        ]);
    }
}
