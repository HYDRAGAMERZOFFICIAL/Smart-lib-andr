<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::all()->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'edition' => $book->edition,
                'publisher' => $book->publisher,
                'isbn' => $book->isbn,
                'category' => $book->category,
                'rack' => $book->rack,
                'shelf' => $book->shelf,
                'cover_image' => $book->cover_image,
                'total_copies' => $book->total_copies,
                'available_copies' => $book->available_copies,
                'is_archived' => $book->is_archived
            ];
        });

        return Inertia::render('Books/Index', [
            'books' => $books
        ]);
    }

    public function show(Book $book)
    {
        $copies = $book->copies()
            ->get()
            ->map(function ($copy) {
                return [
                    'id' => $copy->id,
                    'copy_code' => $copy->copy_code,
                    'barcode' => $copy->barcode,
                    'status' => $copy->status
                ];
            });

        return Inertia::render('Books/Show', [
            'book' => $book,
            'copies' => $copies
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'edition' => 'nullable|string',
            'publisher' => 'nullable|string',
            'isbn' => 'nullable|unique:books',
            'category' => 'required|string',
            'rack' => 'nullable|string',
            'shelf' => 'nullable|string',
            'course' => 'nullable|string',
            'semester' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        $book = Book::create($validated);

        return redirect()->route('books.show', $book)->with('success', 'Book created successfully');
    }

    public function edit(Book $book)
    {
        return Inertia::render('Books/Edit', [
            'book' => $book
        ]);
    }

    public function update(Book $book, Request $request)
    {
        $validated = $request->validate([
            'title' => 'string',
            'author' => 'string',
            'edition' => 'nullable|string',
            'publisher' => 'nullable|string',
            'isbn' => 'nullable|unique:books,isbn,' . $book->id,
            'category' => 'string',
            'rack' => 'nullable|string',
            'shelf' => 'nullable|string',
            'course' => 'nullable|string',
            'semester' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        $book->update($validated);

        return back()->with('success', 'Book updated successfully');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return back()->with('success', 'Book deleted successfully');
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        $books = Book::where('title', 'like', "%$query%")
            ->orWhere('author', 'like', "%$query%")
            ->orWhere('isbn', 'like', "%$query%")
            ->limit(20)
            ->get();

        return response()->json($books);
    }
}
