import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function FinesHistory({ fines = {} }) {
    const [searchTerm, setSearchTerm] = useState('');

    const finesList = fines.data ? Array.isArray(fines.data) ? fines.data : [fines.data] : [];

    const filteredFines = useMemo(() => {
        if (!searchTerm) return finesList;

        return finesList.filter(f =>
            f.loan?.book_copy?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [finesList, searchTerm]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Fine History
                </h2>
            }
        >
            <Head title="Fine History" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Book title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Fines Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Book</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fine Type</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Resolution Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFines.length > 0 ? (
                                        filteredFines.map((fine) => (
                                            <tr key={fine.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {fine.loan?.book_copy?.book?.title || 'Unknown Book'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {fine.fine_type?.replace(/_/g, ' ').charAt(0).toUpperCase() + fine.fine_type?.replace(/_/g, ' ').slice(1) || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    ₹{parseFloat(fine.amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        fine.status === 'waived' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {fine.status?.charAt(0).toUpperCase() + fine.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {fine.paid_date ? new Date(fine.paid_date).toLocaleDateString() :
                                                     fine.waived_date ? new Date(fine.waived_date).toLocaleDateString() :
                                                     '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No fine history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('fines.index')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Fines
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
