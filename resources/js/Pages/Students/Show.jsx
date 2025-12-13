import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentShow({ student, borrowingHistory = [], activeLoans = [], fines = [] }) {
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleResetPassword = () => {
        if (confirm('Reset password for this student?')) {
            router.post(route('students.reset-password', student.id), {
                new_password: resetPassword
            }, {
                onSuccess: () => {
                    setShowPasswordReset(false);
                    setResetPassword('');
                    alert('Password reset successfully');
                },
                onError: () => alert('Error resetting password')
            });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
            blocked: 'bg-gray-100 text-gray-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Student Profile
                    </h2>
                    <Link
                        href={route('students.index')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back
                    </Link>
                </div>
            }
        >
            <Head title={`${student.name} - Profile`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Student Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
                                <p className="text-gray-600 mt-1">ID: {student.id_number}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(student.status)}`}>
                                {student.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <p className="text-gray-900">{student.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <p className="text-gray-900">{student.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Department</label>
                                <p className="text-gray-900">{student.department}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Course</label>
                                <p className="text-gray-900">{student.course}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Semester</label>
                                <p className="text-gray-900">{student.semester}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Registration Date</label>
                                <p className="text-gray-900">{new Date(student.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3 flex-wrap">
                            <Link
                                href={route('library-cards.index')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                View Library Card
                            </Link>
                            <button
                                onClick={() => setShowPasswordReset(!showPasswordReset)}
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
                            >
                                Reset Password
                            </button>
                        </div>

                        {/* Password Reset Form */}
                        {showPasswordReset && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Reset Password</h4>
                                <div className="relative mb-3">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={resetPassword}
                                        onChange={(e) => setResetPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 5c3.478 0 6.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-2.003 0-3.896-.537-5.541-1.506l1.507-1.507c1.22.634 2.614.986 4.034.986 4.418 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-1.42 0-2.814.352-4.034.986L4.459 3.494C6.104 2.537 8 2 10 2z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleResetPassword}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowPasswordReset(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Loans */}
                    {activeLoans.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Loans</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Book Title</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Issued Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeLoans.map((loan) => (
                                            <tr key={loan.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{loan.book_title}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{new Date(loan.issued_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{new Date(loan.due_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        new Date(loan.due_date) < new Date() 
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {new Date(loan.due_date) < new Date() ? 'Overdue' : 'On time'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Fines */}
                    {fines.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Outstanding Fines</h3>
                            <div className="space-y-2">
                                {fines.map((fine) => (
                                    <div key={fine.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                                        <div>
                                            <p className="font-medium text-gray-900">{fine.description}</p>
                                            <p className="text-sm text-gray-600">Due Date: {new Date(fine.due_date).toLocaleDateString()}</p>
                                        </div>
                                        <p className="font-bold text-red-700">₹{fine.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Borrowing History */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrowing History</h3>
                        {borrowingHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Book Title</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Issued Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Returned Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Days Borrowed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowingHistory.map((history) => {
                                            const issued = new Date(history.issued_date);
                                            const returned = new Date(history.returned_date);
                                            const daysBorrowed = Math.floor((returned - issued) / (1000 * 60 * 60 * 24));
                                            return (
                                                <tr key={history.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-900">{history.book_title}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{issued.toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{returned.toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{daysBorrowed} days</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No borrowing history</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
