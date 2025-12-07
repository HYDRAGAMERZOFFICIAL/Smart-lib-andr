import React, { useState } from 'react';
import Layout from '@/layouts/Layout';
import { Book } from '@/types';
import { usePage } from '@inertiajs/react';

interface BooksProps {
  books: Book[];
}

export default function Books({ books: initialBooks }: BooksProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = initialBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Books Catalog</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Publisher:</span> {book.publisher}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Category:</span> {book.category}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Not Available'}
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    {book.availableCopies > 0 ? 'Borrow' : 'Request'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">No books found matching your search.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
