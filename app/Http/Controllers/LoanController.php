<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Loans/Index', [
                'loans' => [],
                'dueSoonCount' => 0,
                'overdueCount' => 0,
                'filters' => ['status' => $request->status]
            ]);
        }

        $loansQuery = Loan::query()
            ->where('student_id', $student->id)
            ->with(['student', 'bookCopy.book']);

        if ($request->status) {
            $loansQuery->where('status', $request->status);
        }

        $loans = $loansQuery->latest()->paginate(25)->withQueryString();

        $dueSoonCount = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays(3)])
            ->count();

        $overdueCount = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->count();

        return Inertia::render('Loans/Index', [
            'loans' => $loans,
            'dueSoonCount' => $dueSoonCount,
            'overdueCount' => $overdueCount,
            'filters' => [
                'status' => $request->status
            ]
        ]);
    }

    public function history()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Loans/History', ['loans' => []]);
        }

        $loans = Loan::where('student_id', $student->id)
            ->where('status', 'returned')
            ->with(['student', 'bookCopy.book'])
            ->latest('returned_date')
            ->paginate(25);

        return Inertia::render('Loans/History', ['loans' => $loans]);
    }
}
