import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({
    totalStudents = 0,
    pendingApprovals = 0,
    totalBooks = 0,
    totalBookCopies = 0,
    booksIssuedToday = 0,
    dueSoon = 0,
    overdue = 0,
    totalStaff = 0,
    fineCollected = 0,
    dailyIssuanceData = [],
    monthlyBorrowingData = [],
    categoryWiseData = [],
    departmentUsageData = []
}) {
    const COLORS = ['#059669', '#14B8A6', '#06B6D4', '#10B981', '#047857', '#0891B2', '#0D9488', '#10B981'];

    const StatCard = ({ icon, label, value, link, bgColor }) => (
        <div className={`${bgColor} rounded-lg p-6 text-white shadow-md hover:shadow-lg transition transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="text-5xl opacity-20">{icon}</div>
            </div>
            {link && (
                <Link href={link} className="mt-4 inline-block text-sm font-medium hover:underline">
                    View Details →
                </Link>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Library Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard
                            icon="👥"
                            label="Total Students"
                            value={totalStudents}
                            link={route('students.index')}
                            bgColor="bg-green-600"
                        />
                        <StatCard
                            icon="⏳"
                            label="Pending Approvals"
                            value={pendingApprovals}
                            link={pendingApprovals > 0 ? route('students.index') : null}
                            bgColor="bg-cyan-600"
                        />
                        <StatCard
                            icon="📚"
                            label="Total Books"
                            value={totalBooks}
                            link={route('books.index')}
                            bgColor="bg-emerald-600"
                        />
                        <StatCard
                            icon="📖"
                            label="Book Copies"
                            value={totalBookCopies}
                            link={route('book-copies.index')}
                            bgColor="bg-teal-600"
                        />
                    </div>

                    {/* Operational Metrics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard
                            icon="📤"
                            label="Issued Today"
                            value={booksIssuedToday}
                            link={route('issue-return.index')}
                            bgColor="bg-green-500"
                        />
                        <StatCard
                            icon="⚠️"
                            label="Due Soon"
                            value={dueSoon}
                            link={route('loans.due-soon')}
                            bgColor="bg-cyan-500"
                        />
                        <StatCard
                            icon="🔴"
                            label="Overdue"
                            value={overdue}
                            link={route('loans.overdue')}
                            bgColor="bg-red-500"
                        />
                        <StatCard
                            icon="👨‍💼"
                            label="Total Staff"
                            value={totalStaff}
                            bgColor="bg-emerald-500"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Daily Issuance Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Issuance</h3>
                            {dailyIssuanceData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dailyIssuanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No data available</p>
                            )}
                        </div>

                        {/* Monthly Borrowing Trends */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
                            {monthlyBorrowingData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyBorrowingData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="issued" fill="#059669" />
                                        <Bar dataKey="returned" fill="#06B6D4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No data available</p>
                            )}
                        </div>

                        {/* Category-wise Most Borrowed */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Borrowed Categories</h3>
                            {categoryWiseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryWiseData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryWiseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No data available</p>
                            )}
                        </div>

                        {/* Department/Semester Usage */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Usage</h3>
                            {departmentUsageData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={departmentUsageData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="department" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="usage" fill="#0D9488" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg shadow-md p-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href={route('students.index')}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center font-medium transition"
                            >
                                Manage Students
                            </Link>
                            <Link
                                href={route('books.index')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-center font-medium transition"
                            >
                                Manage Books
                            </Link>
                            <Link
                                href={route('issue-return.index')}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 text-center font-medium transition"
                            >
                                Issue/Return Books
                            </Link>
                            <Link
                                href={route('library-cards.index')}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-center font-medium transition"
                            >
                                Library Cards
                            </Link>
                            <Link
                                href={route('loans.index')}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-center font-medium transition"
                            >
                                View Loans
                            </Link>
                            <Link
                                href={route('reports.index')}
                                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 text-center font-medium transition"
                            >
                                View Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
