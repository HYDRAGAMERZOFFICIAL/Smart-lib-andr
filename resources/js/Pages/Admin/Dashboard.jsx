import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Smart Library Admin Panel</h3>
                        <p className="mt-2 text-gray-600">
                            Administrative interface for managing the Smart Library System. Restricted to administrators only.
                        </p>
                    </div>

                    {/* Admin Management */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Management</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Card 1 */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">Admin Users</h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Create and manage admin accounts, assign roles and permissions.
                                </p>
                                <Link href={route('admin.users')} className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                                    Manage Admins
                                </Link>
                            </div>

                            {/* Card 2 */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">System Settings</h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Configure library rules, fines, loan policies, and auto-reminders.
                                </p>
                                <Link href={route('admin.settings')} className="mt-4 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                                    Manage Settings
                                </Link>
                            </div>

                            {/* Card 3 */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900">Audit Logs</h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Track all admin actions, issue/returns, and system changes.
                                </p>
                                <Link href={route('admin.audit-logs')} className="mt-4 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700">
                                    View Logs
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* System Reports */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">System Reports</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            View comprehensive system analytics and reports.
                        </p>
                        <Link href={route('admin.reports')} className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                            View Reports
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}