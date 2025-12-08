import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function FineShow({ fine = {} }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Fine Details
                </h2>
            }
        >
            <Head title="Fine Details" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Status Alert */}
                        {fine.status === 'pending' && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-red-800">
                                    This fine is pending and requires payment.
                                </p>
                            </div>
                        )}

                        {/* Fine Amount */}
                        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                            <p className="text-sm font-medium text-orange-700 mb-2">Fine Amount</p>
                            <p className="text-4xl font-bold text-orange-900">₹{parseFloat(fine.amount).toFixed(2)}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Fine Type</p>
                                <p className="text-lg text-gray-900 mt-1">
                                    {fine.fine_type?.replace(/_/g, ' ').charAt(0).toUpperCase() + fine.fine_type?.replace(/_/g, ' ').slice(1) || 'N/A'}
                                </p>
                            </div>

                            {fine.loan?.book_copy?.book && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Book</p>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {fine.loan.book_copy.book.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        by {fine.loan.book_copy.book.author}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-gray-700">Status</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                                    fine.status === 'pending' ? 'bg-red-100 text-red-800' :
                                    fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {fine.status?.charAt(0).toUpperCase() + fine.status?.slice(1)}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Created Date</p>
                                <p className="text-gray-900 mt-1">
                                    {new Date(fine.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {fine.description && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Description</p>
                                    <p className="text-gray-900 mt-1">{fine.description}</p>
                                </div>
                            )}

                            {fine.status === 'paid' && fine.paid_date && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Payment Date</p>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(fine.paid_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {fine.status === 'waived' && fine.waived_date && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Waived Date</p>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(fine.waived_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex gap-3">
                            <Link
                                href={route('fines.index')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition"
                            >
                                Back to Fines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
