import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentDashboard({ summary = {}, recentLoans = [], upcomingDueDates = [], pendingFines = [] }) {
    const { activeLoans = 0, overdueLoans = 0, totalPendingFines = 0 } = summary || {};

    const getDaysRemaining = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (dueDate) => {
        const days = getDaysRemaining(dueDate);
        if (days < 0) return 'bg-red-100 text-red-800';
        if (days <= 3) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (dueDate) => {
        const days = getDaysRemaining(dueDate);
        if (days < 0) return `${Math.abs(days)} days overdue`;
        if (days === 0) return 'Due today';
        return `${days} days remaining`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Dashboard
                </h2>
            }
        >
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-blue-700">Active Loans</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">{activeLoans}</p>
                            <Link href={route('loans.index')} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                                View All →
                            </Link>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-red-700">Overdue Loans</p>
                            <p className="text-3xl font-bold text-red-900 mt-2">{overdueLoans}</p>
                            {overdueLoans > 0 && (
                                <p className="text-xs text-red-600 mt-2">Action required</p>
                            )}
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-orange-700">Pending Fines</p>
                            <p className="text-3xl font-bold text-orange-900 mt-2">₹{totalPendingFines}</p>
                            <Link href={route('fines.index')} className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                                View Fines →
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Upcoming Due Dates */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Due Soon</h3>
                            {upcomingDueDates.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingDueDates.map((loan) => (
                                        <div key={loan.id} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{loan.book_copy?.book?.title || 'Unknown Book'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(loan.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.due_date)}`}>
                                                {getStatusText(loan.due_date)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No books due soon</p>
                            )}
                        </div>

                        {/* Recent Loans */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Loans</h3>
                            {recentLoans.length > 0 ? (
                                <div className="space-y-3">
                                    {recentLoans.slice(0, 5).map((loan) => (
                                        <div key={loan.id} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{loan.book_copy?.book?.title || 'Unknown Book'}</p>
                                                <p className="text-xs text-gray-500">
                                                    Issued: {new Date(loan.issued_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {loan.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No recent loans</p>
                            )}
                        </div>

                        {/* Pending Fines */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Fines</h3>
                            {pendingFines.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingFines.slice(0, 5).map((fine) => (
                                        <div key={fine.id} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {fine.loan?.book_copy?.book?.title || 'Unknown Book'}
                                                </p>
                                                <p className="text-xs text-gray-500">{fine.fine_type} - {new Date(fine.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                                                ₹{parseFloat(fine.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No pending fines</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Link
                                href={route('loans.index')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-medium transition"
                            >
                                View My Loans
                            </Link>
                            <Link
                                href={route('fines.index')}
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-center font-medium transition"
                            >
                                Manage Fines
                            </Link>
                            <Link
                                href={route('student.profile')}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center font-medium transition"
                            >
                                My Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
