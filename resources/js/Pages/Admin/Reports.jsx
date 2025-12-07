import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Reports({ userStats, transactionStats, categoryStats, timeframe: initialTimeframe = 'month' }) {
    const [timeframe, setTimeframe] = useState(initialTimeframe);
    
    // Update timeframe when initialTimeframe prop changes
    useEffect(() => {
        if (initialTimeframe && timeframe !== initialTimeframe) {
            setTimeframe(initialTimeframe);
        }
    }, [initialTimeframe]);

    const userChartData = {
        labels: ['Admin Users', 'Regular Users', 'Verified Users', 'Unverified Users'],
        datasets: [
            {
                label: 'User Statistics',
                data: [
                    userStats.adminCount,
                    userStats.memberCount,
                    userStats.verifiedCount,
                    userStats.unverifiedCount
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const transactionChartData = {
        labels: transactionStats.labels,
        datasets: [
            {
                label: 'Income',
                data: transactionStats.incomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expense',
                data: transactionStats.expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const categoryChartData = {
        labels: categoryStats.labels,
        datasets: [
            {
                label: 'Transaction Count by Category',
                data: categoryStats.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    System Reports
                </h2>
            }
        >
            <Head title="System Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {timeframe === 'week' ? 'Last 7 Days Report' : 
                             timeframe === 'month' ? 'Previous Month Report' : 
                             timeframe === 'year' ? 'Previous Year Report' : 
                             'All Time Report'}
                        </h2>
                        <select
                            value={timeframe}
                            onChange={(e) => {
                                const newTimeframe = e.target.value;
                                // Only update the URL, don't set state directly
                                // The state will be updated by the useEffect hook
                                router.visit(route('admin.reports', { timeframe: newTimeframe }), {
                                    preserveScroll: true,
                                    preserveState: false // Don't preserve state to ensure fresh data
                                });
                            }}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="week">Last 7 Days</option>
                            <option value="month">Previous Month</option>
                            <option value="year">Previous Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                {timeframe === 'all' ? 'User Statistics (All Time)' : 
                                 timeframe === 'week' ? 'User Statistics (Last 7 Days)' : 
                                 timeframe === 'month' ? 'User Statistics (Last Month)' : 
                                 'User Statistics (Last Year)'}
                            </h3>
                            <div className="h-64">
                                <Pie 
                                    data={userChartData} 
                                    options={{ maintainAspectRatio: false }} 
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="rounded-md bg-blue-50 p-4">
                                    <p className="text-sm font-medium text-blue-800">Total Users</p>
                                    <p className="text-2xl font-bold text-blue-900">{userStats.totalUsers}</p>
                                </div>
                                <div className="rounded-md bg-green-50 p-4">
                                    <p className="text-sm font-medium text-green-800">
                                        {timeframe === 'all' ? 'New Users (30d)' : 
                                         timeframe === 'week' ? 'New Users (7d)' : 
                                         timeframe === 'month' ? 'New Users (Last Month)' : 
                                         'New Users (Last Year)'}
                                    </p>
                                    <p className="text-2xl font-bold text-green-900">{userStats.newUsers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                {timeframe === 'all' ? 'Transaction Statistics (All Time)' : 
                                 timeframe === 'week' ? 'Transaction Statistics (Last 7 Days)' : 
                                 timeframe === 'month' ? 'Transaction Statistics (Last Month)' : 
                                 'Transaction Statistics (Last Year)'}
                            </h3>
                            <div className="h-64">
                                <Bar 
                                    data={transactionChartData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }} 
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="rounded-md bg-purple-50 p-4">
                                    <p className="text-sm font-medium text-purple-800">
                                        {timeframe === 'all' ? 'Total Transactions' : 
                                         timeframe === 'week' ? 'Transactions (7d)' : 
                                         timeframe === 'month' ? 'Transactions (Last Month)' : 
                                         'Transactions (Last Year)'}
                                    </p>
                                    <p className="text-2xl font-bold text-purple-900">{transactionStats.totalTransactions}</p>
                                </div>
                                <div className="rounded-md bg-yellow-50 p-4">
                                    <p className="text-sm font-medium text-yellow-800">
                                        {timeframe === 'all' ? 'Avg. Transaction (All Time)' : 
                                         timeframe === 'week' ? 'Avg. Transaction (7d)' : 
                                         timeframe === 'month' ? 'Avg. Transaction (Last Month)' : 
                                         'Avg. Transaction (Last Year)'}
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-900">₹{transactionStats.avgAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">
                            {timeframe === 'all' ? 'Category Distribution (All Time)' : 
                             timeframe === 'week' ? 'Category Distribution (Last 7 Days)' : 
                             timeframe === 'month' ? 'Category Distribution (Last Month)' : 
                             'Category Distribution (Last Year)'}
                        </h3>
                        <div className="h-64">
                            <Pie 
                                data={categoryChartData} 
                                options={{ maintainAspectRatio: false }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}