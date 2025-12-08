import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function LoansHistory({ loans = {} }) {
    const [searchTerm, setSearchTerm] = useState('');

    const loansList = loans.data ? Array.isArray(loans.data) ? loans.data : [loans.data] : [];

    const filteredLoans = useMemo(() => {
        if (!searchTerm) return loansList;

        return loansList.filter(l =>
            l.book_copy?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [loansList, searchTerm]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Loan History
                </h2>
            }
        >
            <Head title="Loan History" />

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

                    {/* Loans Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Book</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Author</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issued Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Returned Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLoans.length > 0 ? (
                                        filteredLoans.map((loan) => {
                                            const issuedDate = new Date(loan.issued_date);
                                            const returnedDate = new Date(loan.returned_date);
                                            const duration = Math.ceil((returnedDate - issuedDate) / (1000 * 60 * 60 * 24));

                                            return (
                                                <tr key={loan.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {loan.book_copy?.book?.title || 'Unknown Book'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {loan.book_copy?.book?.author || 'Unknown Author'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {issuedDate.toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {returnedDate.toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {duration} days
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No returned loans found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('loans.index')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Loans
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
