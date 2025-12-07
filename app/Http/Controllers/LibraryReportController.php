<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\IssueReturnTransaction;
use App\Models\Fine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function issuedBooks(Request $request)
    {
        $query = Loan::where('status', '!=', 'lost');

        if ($request->has('start_date')) {
            $query->whereDate('issued_date', '>=', $request->input('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('issued_date', '<=', $request->input('end_date'));
        }

        $loans = $query->with(['student', 'book'])->get();

        return Inertia::render('Reports/IssuedBooks', ['loans' => $loans]);
    }

    public function returnedBooks(Request $request)
    {
        $query = Loan::where('status', 'returned');

        if ($request->has('start_date')) {
            $query->whereDate('returned_date', '>=', $request->input('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('returned_date', '<=', $request->input('end_date'));
        }

        $loans = $query->with(['student', 'book'])->get();

        return Inertia::render('Reports/ReturnedBooks', ['loans' => $loans]);
    }

    public function overdueReport()
    {
        $loans = Loan::where('status', 'active')
            ->where('due_date', '<', now())
            ->with(['student', 'book'])
            ->get();

        return Inertia::render('Reports/OverdueReport', ['loans' => $loans]);
    }

    public function studentWise(Request $request)
    {
        $students = \App\Models\Student::withCount('loans')
            ->with('activeLoans')
            ->get();

        return Inertia::render('Reports/StudentWise', ['students' => $students]);
    }

    public function bookWise(Request $request)
    {
        $books = \App\Models\Book::withCount('loans')
            ->orderByDesc('loans_count')
            ->get();

        return Inertia::render('Reports/BookWise', ['books' => $books]);
    }

    public function fineCollection(Request $request)
    {
        $fines = Fine::with('student')->get();

        $summary = [
            'total_pending' => $fines->where('status', 'pending')->sum('amount'),
            'total_paid' => $fines->where('status', 'paid')->sum('amount'),
            'total_waived' => $fines->where('status', 'waived')->sum('amount'),
        ];

        return Inertia::render('Reports/FineCollection', [
            'fines' => $fines,
            'summary' => $summary
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'report_type' => 'required|in:issued-books,returned-books,overdue,student-wise,book-wise,fine-collection',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'format' => 'required|in:csv,pdf,excel'
        ]);

        $data = match($validated['report_type']) {
            'issued-books' => Loan::whereBetween('issued_date', [$validated['start_date'], $validated['end_date']])
                ->with(['student', 'book'])->get(),
            'returned-books' => Loan::where('status', 'returned')
                ->whereBetween('returned_date', [$validated['start_date'], $validated['end_date']])
                ->with(['student', 'book'])->get(),
            'overdue' => Loan::where('status', 'active')->where('due_date', '<', now())
                ->with(['student', 'book'])->get(),
            default => []
        };

        if ($validated['format'] === 'csv') {
            return $this->exportCsv($data, $validated['report_type']);
        } elseif ($validated['format'] === 'pdf') {
            return $this->exportPdf($data, $validated['report_type']);
        }

        return back()->with('error', 'Export format not supported');
    }

    private function exportCsv($data, $reportType)
    {
        $filename = "{$reportType}-" . now()->format('Y-m-d-H-i-s') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Student', 'Book', 'Date', 'Due Date', 'Status']);

            foreach ($data as $row) {
                fputcsv($file, [
                    $row->student->name,
                    $row->book->title,
                    $row->issued_date,
                    $row->due_date,
                    $row->status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportPdf($data, $reportType)
    {
        return response()->json(['message' => 'PDF export functionality to be implemented']);
    }
}
