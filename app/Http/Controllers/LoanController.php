<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    private function getBaseQuery()
    {
        $user = auth()->user();
        $query = Loan::query();
        
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }
        
        return $query;
    }

    public function index(Request $request)
    {
        $loansQuery = $this->getBaseQuery()
            ->with(['student', 'bookCopy.book', 'user']);

        if ($request->status) {
            $loansQuery->where('status', $request->status);
        }

        $loans = $loansQuery->latest()->paginate(25)->withQueryString();

        $dueSoonCount = $this->getBaseQuery()
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays(3)])
            ->count();

        $overdueCount = $this->getBaseQuery()
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

    public function dueSoon()
    {
        $loans = $this->getBaseQuery()
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays(3)])
            ->with(['student', 'bookCopy.book'])
            ->latest()
            ->paginate(25);

        return Inertia::render('Loans/DueSoon', ['loans' => $loans]);
    }

    public function overdue()
    {
        $loans = $this->getBaseQuery()
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->with(['student', 'bookCopy.book'])
            ->latest()
            ->paginate(25);

        return Inertia::render('Loans/Overdue', ['loans' => $loans]);
    }

    public function sendReminder(Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'loan_ids' => 'required|array',
            'loan_ids.*' => 'exists:loans,id'
        ]);

        foreach ($validated['loan_ids'] as $loanId) {
            $loan = Loan::find($loanId);

            if ($user->role !== 'admin' && $loan->user_id !== $user->id) {
                continue;
            }

            $student = $loan->student;

            Notification::create([
                'student_id' => $student->id,
                'type' => 'due_reminder',
                'title' => 'Due Date Reminder',
                'message' => "Your book '{$loan->bookCopy->book->title}' is due on {$loan->due_date->toDateString()}",
                'subject' => 'Library Book Due Date Reminder',
                'channel' => 'email',
                'created_by' => $user->name
            ]);
        }

        return back()->with('success', 'Reminders sent successfully');
    }

    public function waiveFine(Loan $loan)
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && $loan->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $loan->waiveFine($user->name, 'Waived by admin');

        return back()->with('success', 'Fine waived successfully');
    }
}
