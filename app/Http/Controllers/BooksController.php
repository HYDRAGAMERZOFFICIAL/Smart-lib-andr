<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BooksController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
        }

        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }

        if ($request->has('availability')) {
            if ($request->get('availability') === 'available') {
                $query->where('available_copies', '>', 0);
            }
        }

        $books = $query->paginate(12);

        return Inertia::render('Books', [
            'books' => $books,
        ]);
    }

    public function show(Book $book)
    {
        return Inertia::render('BookDetail', [
            'book' => $book,
        ]);
    }
}
