<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Loan;
use App\Models\Fine;
use App\Models\LibraryCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function profile()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return back()->with('error', 'Student profile not found');
        }

        $libraryCard = LibraryCard::where('student_id', $student->id)
            ->where('status', 'active')
            ->first();

        $activeLoans = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->with('bookCopy.book')
            ->count();

        $totalPendingFines = Fine::where('student_id', $student->id)
            ->where('status', 'pending')
            ->sum('amount');

        return Inertia::render('Student/Profile', [
            'student' => $student,
            'libraryCard' => $libraryCard,
            'activeLoans' => $activeLoans,
            'totalPendingFines' => $totalPendingFines,
            'user' => $user
        ]);
    }

    public function edit()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return back()->with('error', 'Student profile not found');
        }

        return Inertia::render('Student/Edit', [
            'student' => $student,
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return back()->with('error', 'Student profile not found');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'photo' => 'nullable|image|max:2048',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20'
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('student_photos', 'public');
            $validated['photo'] = $path;
        }

        $student->update($validated);

        if ($request->has('name')) {
            $user->update(['name' => $validated['name']]);
        }

        return back()->with('success', 'Profile updated successfully');
    }

    public function dashboard()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Student/Dashboard', [
                'summary' => null,
                'recentLoans' => [],
                'upcomingDueDates' => [],
                'pendingFines' => []
            ]);
        }

        $activeLoans = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->with('bookCopy.book')
            ->count();

        $overdueLoans = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->count();

        $totalPendingFines = Fine::where('student_id', $student->id)
            ->where('status', 'pending')
            ->sum('amount');

        $recentLoans = Loan::where('student_id', $student->id)
            ->with('bookCopy.book')
            ->latest('issued_date')
            ->limit(5)
            ->get();

        $upcomingDueDates = Loan::where('student_id', $student->id)
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays(7)])
            ->with('bookCopy.book')
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        $pendingFines = Fine::where('student_id', $student->id)
            ->where('status', 'pending')
            ->with('loan.bookCopy.book')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'summary' => [
                'activeLoans' => $activeLoans,
                'overdueLoans' => $overdueLoans,
                'totalPendingFines' => $totalPendingFines
            ],
            'recentLoans' => $recentLoans,
            'upcomingDueDates' => $upcomingDueDates,
            'pendingFines' => $pendingFines
        ]);
    }
}
