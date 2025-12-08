<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FineController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Fines/Index', [
                'fines' => [],
                'totalPending' => 0,
                'filters' => ['status' => $request->status]
            ]);
        }

        $finesQuery = Fine::query()
            ->where('student_id', $student->id)
            ->with('loan.bookCopy.book');

        if ($request->status) {
            $finesQuery->where('status', $request->status);
        }

        $fines = $finesQuery->latest()->paginate(20)->withQueryString();

        $totalPending = Fine::where('student_id', $student->id)
            ->where('status', 'pending')
            ->sum('amount');

        return Inertia::render('Fines/Index', [
            'fines' => $fines,
            'totalPending' => $totalPending,
            'filters' => [
                'status' => $request->status
            ]
        ]);
    }

    public function show(Fine $fine)
    {
        $this->authorize('view', $fine);

        $fine->load('loan.bookCopy.book');

        return Inertia::render('Fines/Show', [
            'fine' => $fine
        ]);
    }

    public function history()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Fines/History', ['fines' => []]);
        }

        $fines = Fine::where('student_id', $student->id)
            ->whereIn('status', ['paid', 'waived'])
            ->with('loan.bookCopy.book')
            ->latest('paid_date')
            ->paginate(20);

        return Inertia::render('Fines/History', ['fines' => $fines]);
    }
}
