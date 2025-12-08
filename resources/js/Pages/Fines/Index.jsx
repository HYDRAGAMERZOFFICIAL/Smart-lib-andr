import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function FinesIndex({ fines = {}, totalPending = 0, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const finesList = fines.data ? Array.isArray(fines.data) ? fines.data : [fines.data] : [];

    const filteredFines = useMemo(() => {
        let filtered = finesList;

        if (searchTerm) {
            filtered = filtered.filter(f =>
                f.loan?.book_copy?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(f => f.status === statusFilter);
        }

        return filtered;
    }, [finesList, searchTerm, statusFilter]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Fines
                </h2>
            }
        >
            <Head title="Fines" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-red-700">Pending Fines</p>
                            <p className="text-3xl font-bold text-red-900 mt-2">₹{parseFloat(totalPending).toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-green-700">Total Fines Count</p>
                            <p className="text-3xl font-bold text-green-900 mt-2">{finesList.length}</p>
                            <Link href={route('fines.history')} className="text-xs text-green-600 hover:underline mt-2 inline-block">
                                View History →
                            </Link>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Book title"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex-1 md:ml-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="waived">Waived</option>
                                </select>
                            </div>
                        </div>
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
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
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
                                                        fine.status === 'pending' ? 'bg-red-100 text-red-800' :
                                                        fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {fine.status?.charAt(0).toUpperCase() + fine.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(fine.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <Link
                                                        href={route('fines.show', fine.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No fines found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
