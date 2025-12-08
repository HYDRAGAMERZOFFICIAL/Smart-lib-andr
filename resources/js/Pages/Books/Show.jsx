import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function BookShow({ book = {} }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Book Details
                </h2>
            }
        >
            <Head title="Book Details" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Cover Image */}
                            <div className="md:col-span-1">
                                {book.cover_image ? (
                                    <img 
                                        src={book.cover_image} 
                                        alt={book.title}
                                        className="w-full h-96 object-cover rounded-lg shadow-md"
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">No Cover Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Book Details */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Title */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                                </div>

                                {/* Availability Status */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Available Copies</p>
                                            <p className="text-2xl font-bold text-blue-900">{book.available_copies || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Total Copies</p>
                                            <p className="text-2xl font-bold text-blue-900">{book.total_copies || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Author */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Author</p>
                                    <p className="text-lg text-gray-900 mt-1">{book.author || 'N/A'}</p>
                                </div>

                                {/* ISBN */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">ISBN</p>
                                    <p className="text-lg text-gray-900 mt-1">{book.isbn || 'N/A'}</p>
                                </div>

                                {/* Publisher */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Publisher</p>
                                    <p className="text-lg text-gray-900 mt-1">{book.publisher || 'N/A'}</p>
                                </div>

                                {/* Edition */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Edition</p>
                                    <p className="text-lg text-gray-900 mt-1">{book.edition || 'N/A'}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Category</p>
                                    <p className="text-lg text-gray-900 mt-1">{book.category || 'N/A'}</p>
                                </div>

                                {/* Location */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Rack</p>
                                        <p className="text-lg text-gray-900 mt-1">{book.rack || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Shelf</p>
                                        <p className="text-lg text-gray-900 mt-1">{book.shelf || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Course and Semester */}
                                {(book.course || book.semester) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {book.course && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Course</p>
                                                <p className="text-lg text-gray-900 mt-1">{book.course}</p>
                                            </div>
                                        )}
                                        {book.semester && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Semester</p>
                                                <p className="text-lg text-gray-900 mt-1">{book.semester}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex gap-3">
                            <Link
                                href={route('books.index')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition"
                            >
                                Back to Books
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
