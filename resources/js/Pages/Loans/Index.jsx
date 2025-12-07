import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function LoansIndex({ loans = [], dueSoonCount = 0, overdueCount = 0 }) {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedLoans, setSelectedLoans] = useState([]);

    const filteredLoans = useMemo(() => {
        let filtered = loans;

        if (searchTerm) {
            filtered = filtered.filter(l =>
                l.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.book_title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeTab === 'due-soon') {
            filtered = filtered.filter(l => {
                const dueDate = new Date(l.due_date);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return daysUntilDue > 0 && daysUntilDue <= 3;
            });
        } else if (activeTab === 'overdue') {
            filtered = filtered.filter(l => new Date(l.due_date) < new Date());
        }

        return filtered;
    }, [loans, searchTerm, activeTab]);

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

    const handleSendReminders = () => {
        if (selectedLoans.length === 0) {
            alert('Please select at least one loan');
            return;
        }

        router.post(route('loans.send-reminder'), {
            loan_ids: selectedLoans
        }, {
            onSuccess: () => {
                setSelectedLoans([]);
                alert('Reminders sent successfully');
            },
            onError: () => alert('Error sending reminders')
        });
    };

    const handleWaiveFine = (loanId) => {
        if (confirm('Waive fine for this loan?')) {
            router.post(route('loans.waive-fine', loanId), {}, {
                onSuccess: () => alert('Fine waived successfully'),
                onError: () => alert('Error waiving fine')
            });
        }
    };

    const toggleSelectLoan = (loanId) => {
        setSelectedLoans(prev =>
            prev.includes(loanId)
                ? prev.filter(id => id !== loanId)
                : [...prev, loanId]
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Loan Tracking
                </h2>
            }
        >
            <Head title="Loans" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-blue-700">Total Active Loans</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">{loans.length}</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-yellow-700">Due Soon (3 days)</p>
                            <p className="text-3xl font-bold text-yellow-900 mt-2">{dueSoonCount}</p>
                            <Link href={route('loans.due-soon')} className="text-xs text-yellow-600 hover:underline mt-2 inline-block">
                                View Details →
                            </Link>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <p className="text-sm font-medium text-red-700">Overdue</p>
                            <p className="text-3xl font-bold text-red-900 mt-2">{overdueCount}</p>
                            <Link href={route('loans.overdue')} className="text-xs text-red-600 hover:underline mt-2 inline-block">
                                View Details →
                            </Link>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Student name or Book title"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {selectedLoans.length > 0 && (
                                <button
                                    onClick={() => setShowReminderModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                                >
                                    Send Reminder ({selectedLoans.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reminder Modal */}
                    {showReminderModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Reminder</h3>
                                <p className="text-gray-600 mb-6">
                                    Send reminder notifications to {selectedLoans.length} student(s)?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSendReminders}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                    >
                                        Send
                                    </button>
                                    <button
                                        onClick={() => setShowReminderModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loans Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            <input type="checkbox" className="rounded" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Book</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issued Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLoans.length > 0 ? (
                                        filteredLoans.map((loan) => (
                                            <tr key={loan.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLoans.includes(loan.id)}
                                                        onChange={() => toggleSelectLoan(loan.id)}
                                                        className="rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{loan.student_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{loan.book_title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(loan.issued_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(loan.due_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.due_date)}`}>
                                                        {getStatusText(loan.due_date)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    {getDaysRemaining(loan.due_date) < 0 && loan.fine > 0 && (
                                                        <button
                                                            onClick={() => handleWaiveFine(loan.id)}
                                                            className="inline-block px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                                                        >
                                                            Waive Fine
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No loans found
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
