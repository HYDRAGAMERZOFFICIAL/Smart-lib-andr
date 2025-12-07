<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BooksController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->is_approved) {
            return redirect('/login');
        }

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

        $books = $query->select('id', 'title', 'author', 'publisher', 'category', 'available_copies', 'total_copies')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Books', [
            'books' => $books,
        ]);
    }

    public function show(Book $book)
    {
        $user = Auth::user();
        
        if (!$user || !$user->is_approved) {
            return redirect('/login');
        }

        return Inertia::render('BookDetail', [
            'book' => $book->only('id', 'isbn', 'title', 'author', 'publisher', 'edition', 'category', 'description', 'available_copies', 'total_copies', 'language', 'publication_year'),
        ]);
    }
}
