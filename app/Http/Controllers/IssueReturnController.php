<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Student;
use App\Models\BookCopy;
use App\Models\IssueReturnTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IssueReturnController extends Controller
{
    public function index()
    {
        $recentTransactions = IssueReturnTransaction::with(['student', 'book'])
            ->latest('transaction_date')
            ->limit(10)
            ->get()
            ->map(function ($trans) {
                return [
                    'id' => $trans->id,
                    'student_name' => $trans->student->name,
                    'book_title' => $trans->book->title,
                    'type' => $trans->type,
                    'created_at' => $trans->transaction_date
                ];
            });

        return Inertia::render('IssueReturn/Index', [
            'recentTransactions' => $recentTransactions
        ]);
    }

    public function validate(Request $request)
    {
        $studentBarcode = $request->input('student_barcode');
        $bookBarcode = $request->input('book_barcode');
        $type = $request->input('type', 'issue');

        $validation = ['valid' => true, 'message' => ''];

        if ($type === 'issue') {
            $student = Student::where('id_number', $studentBarcode)
                ->orWhereHas('libraryCard', function ($q) use ($studentBarcode) {
                    $q->where('barcode', $studentBarcode)->where('status', 'active');
                })
                ->first();

            if (!$student || $student->status !== 'approved') {
                $validation = ['valid' => false, 'message' => 'Student not found or not approved'];
                return response()->json(['validation' => $validation]);
            }

            $bookCopy = BookCopy::where('barcode', $bookBarcode)
                ->orWhere('copy_code', $bookBarcode)
                ->first();

            if (!$bookCopy || $bookCopy->status !== 'available') {
                $validation = ['valid' => false, 'message' => 'Book copy not found or not available'];
                return response()->json(['validation' => $validation]);
            }

            $activeLoansCount = $student->activeLoans()->count();
            if ($activeLoansCount >= 5) {
                $validation = ['valid' => false, 'message' => 'Student has reached maximum loan limit'];
                return response()->json(['validation' => $validation]);
            }

            $dueDate = now()->addDays(14);

            return response()->json(['validation' => [
                'valid' => true,
                'student' => ['name' => $student->name, 'id_number' => $student->id_number],
                'book' => ['title' => $bookCopy->book->title],
                'due_date' => $dueDate->toDateString(),
                'message' => 'Ready to issue'
            ]]);
        }

        return response()->json(['validation' => $validation]);
    }

    public function issue(Request $request)
    {
        $studentBarcode = $request->input('student_barcode');
        $bookBarcode = $request->input('book_barcode');

        $student = Student::where('id_number', $studentBarcode)
            ->orWhereHas('libraryCard', function ($q) use ($studentBarcode) {
                $q->where('barcode', $studentBarcode)->where('status', 'active');
            })
            ->first();

        $bookCopy = BookCopy::where('barcode', $bookBarcode)
            ->orWhere('copy_code', $bookBarcode)
            ->first();

        if (!$student || !$bookCopy || $bookCopy->status !== 'available') {
            return back()->with('error', 'Invalid student or book');
        }

        $dueDate = now()->addDays(14);

        $loan = Loan::create([
            'student_id' => $student->id,
            'book_copy_id' => $bookCopy->id,
            'book_id' => $bookCopy->book_id,
            'issued_date' => now(),
            'due_date' => $dueDate,
            'status' => 'active',
            'issued_by' => auth()->user()->name,
            'issued_by_id' => auth()->id()
        ]);

        $bookCopy->update(['status' => 'issued']);

        IssueReturnTransaction::create([
            'student_id' => $student->id,
            'book_copy_id' => $bookCopy->id,
            'book_id' => $bookCopy->book_id,
            'type' => 'issue',
            'transaction_date' => now(),
            'processed_by' => auth()->user()->name,
            'is_successful' => true
        ]);

        $bookCopy->book->updateAvailableCopiesCount();

        return back()->with('success', 'Book issued successfully');
    }

    public function return(Request $request)
    {
        $bookBarcode = $request->input('book_barcode');

        $bookCopy = BookCopy::where('barcode', $bookBarcode)
            ->orWhere('copy_code', $bookBarcode)
            ->first();

        if (!$bookCopy) {
            return back()->with('error', 'Book copy not found');
        }

        $loan = $bookCopy->currentLoan()->first();

        if (!$loan) {
            return back()->with('error', 'No active loan found for this book');
        }

        $loan->markAsReturned(auth()->user()->name, null, auth()->id());

        IssueReturnTransaction::create([
            'student_id' => $loan->student_id,
            'book_copy_id' => $bookCopy->id,
            'book_id' => $bookCopy->book_id,
            'type' => 'return',
            'transaction_date' => now(),
            'processed_by' => auth()->user()->name,
            'is_successful' => true
        ]);

        return back()->with('success', 'Book returned successfully');
    }
}
