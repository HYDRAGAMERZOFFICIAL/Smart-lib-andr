import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function BooksIndex({ books = [] }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('title');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        edition: '',
        publisher: '',
        isbn: '',
        category: '',
        rack: '',
        shelf: '',
        course: '',
        semester: ''
    });

    const filteredBooks = useMemo(() => {
        let filtered = books;

        if (searchTerm) {
            filtered = filtered.filter(b =>
                b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.isbn?.includes(searchTerm)
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(b => b.category === filterCategory);
        }

        filtered.sort((a, b) => {
            if (sortBy === 'title') return a.title?.localeCompare(b.title);
            if (sortBy === 'author') return a.author?.localeCompare(b.author);
            if (sortBy === 'category') return a.category?.localeCompare(b.category);
            return 0;
        });

        return filtered;
    }, [books, searchTerm, filterCategory, sortBy]);

    const categories = [...new Set(books.map(b => b.category))].filter(Boolean);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateBook = (e) => {
        e.preventDefault();
        router.post(route('books.store'), formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setFormData({
                    title: '',
                    author: '',
                    edition: '',
                    publisher: '',
                    isbn: '',
                    category: '',
                    rack: '',
                    shelf: '',
                    course: '',
                    semester: ''
                });
                alert('Book created successfully');
            },
            onError: () => alert('Error creating book')
        });
    };

    const handleDeleteBook = (bookId) => {
        if (confirm('Delete this book?')) {
            router.delete(route('books.destroy', bookId), {
                onSuccess: () => alert('Book deleted successfully'),
                onError: () => alert('Error deleting book')
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Book Management
                </h2>
            }
        >
            <Head title="Books" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Action Button */}
                    {isAdmin && (
                        <div className="mb-6 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                            >
                                Add New Book
                            </button>
                        </div>
                    )}

                    {/* Create Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full my-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Book</h3>

                                <form onSubmit={handleCreateBook}>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="author"
                                            placeholder="Author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="edition"
                                            placeholder="Edition"
                                            value={formData.edition}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="publisher"
                                            placeholder="Publisher"
                                            value={formData.publisher}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="isbn"
                                            placeholder="ISBN"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="category"
                                            placeholder="Category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="rack"
                                            placeholder="Rack"
                                            value={formData.rack}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="shelf"
                                            placeholder="Shelf"
                                            value={formData.shelf}
                                            onChange={handleInputChange}
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                        >
                                            Create Book
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters & Search</h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Title, Author, or ISBN"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                    <option value="category">Category</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredBooks.length} of {books.length} books
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                    <div className="mb-4">
                                        {book.cover_image ? (
                                            <img src={book.cover_image} alt={book.title} className="w-full h-48 object-cover rounded-md mb-4" />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                                <span className="text-gray-500">No Cover</span>
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h4>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Author:</strong> {book.author}</p>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Category:</strong> {book.category}</p>
                                    <p className="text-sm text-gray-600 mb-1"><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
                                    <p className="text-sm text-gray-600 mb-4"><strong>Location:</strong> {book.rack}/{book.shelf}</p>

                                    <div className="flex gap-2">
                                        <Link
                                            href={route('books.show', book.id)}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center text-xs font-medium"
                                        >
                                            View
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href={route('books.edit', book.id)}
                                                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-center text-xs font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No books found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
