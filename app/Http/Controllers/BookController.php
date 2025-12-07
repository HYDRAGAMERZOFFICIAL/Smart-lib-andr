<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        if ($request->has('course') && $request->course) {
            $query->where('course', $request->course);
        }

        if ($request->has('semester') && $request->semester) {
            $query->where('semester', $request->semester);
        }

        if ($request->has('available_only') && $request->available_only) {
            $query->where('available_copies', '>', 0);
        }

        $books = $query->paginate(20)->map(function ($book) {
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
        return Inertia::render('Books/Show', [
            'book' => $book,
            'available_copies' => $book->available_copies,
            'total_copies' => $book->total_copies
        ]);
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

    public function scanBarcode(Request $request)
    {
        $barcode = $request->input('barcode');

        $book = Book::where('barcode', $barcode)->first();

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'isbn' => $book->isbn,
            'publisher' => $book->publisher,
            'available_copies' => $book->available_copies,
            'total_copies' => $book->total_copies
        ]);
    }
}
