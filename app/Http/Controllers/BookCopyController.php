<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookCopyController extends Controller
{
    public function index()
    {
        $copies = BookCopy::with('book')
            ->get()
            ->map(function ($copy) {
                return [
                    'id' => $copy->id,
                    'book_title' => $copy->book->title,
                    'copy_code' => $copy->copy_code,
                    'barcode' => $copy->barcode,
                    'status' => $copy->status,
                    'acquisition_date' => $copy->acquisition_date
                ];
            });

        return Inertia::render('BookCopies/Index', [
            'copies' => $copies
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'copy_code' => 'required|unique:book_copies',
            'barcode' => 'required|unique:book_copies',
            'acquisition_date' => 'nullable|date'
        ]);

        $copy = BookCopy::create($validated);

        $book = Book::find($validated['book_id']);
        $book->updateAvailableCopiesCount();

        return back()->with('success', 'Book copy added successfully');
    }

    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'count' => 'required|integer|min:1|max:100',
            'acquisition_date' => 'nullable|date'
        ]);

        $book = Book::find($validated['book_id']);
        $copies = [];

        for ($i = 1; $i <= $validated['count']; $i++) {
            $copyCode = $book->id . '-' . str_pad($book->copies()->count() + $i, 4, '0', STR_PAD_LEFT);
            $barcode = 'BAR-' . $book->id . '-' . str_pad($book->copies()->count() + $i, 6, '0', STR_PAD_LEFT);

            $copies[] = [
                'book_id' => $validated['book_id'],
                'copy_code' => $copyCode,
                'barcode' => $barcode,
                'acquisition_date' => $validated['acquisition_date'] ?? now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        BookCopy::insert($copies);

        $book->updateAvailableCopiesCount();

        return back()->with('success', $validated['count'] . ' book copies added successfully');
    }

    public function updateStatus(BookCopy $copy, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,issued,lost,damaged',
            'condition_notes' => 'nullable|string'
        ]);

        $copy->update($validated);

        $copy->book->updateAvailableCopiesCount();

        return back()->with('success', 'Book copy status updated successfully');
    }

    public function printBarcodes()
    {
        $copies = BookCopy::where('status', 'available')
            ->with('book')
            ->get();

        return Inertia::render('BookCopies/PrintBarcodes', [
            'copies' => $copies
        ]);
    }
}
