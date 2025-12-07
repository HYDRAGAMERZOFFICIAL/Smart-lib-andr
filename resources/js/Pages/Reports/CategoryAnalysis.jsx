import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CategoryAnalysis({ auth, category, filters, summary, transactions, trends }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        period: filters.period || 'month',
        category_id: category.id
    });
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    // Prepare trend data
    const trendData = {
        labels: trends.displayLabels || trends.labels,
        datasets: [
            {
                label: category.name,
                data: trends.data,
                borderColor: category.color,
                backgroundColor: `${category.color}33`,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: category.color,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ],
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Category Analysis</h2>}
        >
            <Head title={`Category Analysis: ${category.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('reports.index')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            &larr; Back to Reports
                        </Link>
                    </div>
                    
                    {/* Category Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                        category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div 
                                        className="w-6 h-6 rounded mr-2" 
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span>{category.color}</span>
                                </div>
                            </div>
                            <div>
                                <Link
                                    href={route('categories.show', category.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    View Category Details
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filter Controls */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Analysis Period</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Link
                                href={route('reports.category-analysis', { category_id: category.id, period: 'week' })}
                                className={`px-4 py-2 rounded-lg ${filters.period === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                This Week
                            </Link>
                            <Link
                                href={route('reports.category-analysis', { category_id: category.id, period: 'month' })}
                                className={`px-4 py-2 rounded-lg ${filters.period === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                This Month
                            </Link>
                            <Link
                                href={route('reports.category-analysis', { category_id: category.id, period: 'quarter' })}
                                className={`px-4 py-2 rounded-lg ${filters.period === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                This Quarter
                            </Link>
                            <Link
                                href={route('reports.category-analysis', { category_id: category.id, period: 'year' })}
                                className={`px-4 py-2 rounded-lg ${filters.period === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                This Year
                            </Link>
                            <button
                                type="button"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={`px-4 py-2 rounded-lg ${filters.period === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Custom Range
                            </button>
                        </div>
                        
                        {/* Custom Date Range Picker */}
                        {showDatePicker && (
                            <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                                <h4 className="font-medium mb-3">Select Custom Date Range</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            get(route('reports.category-analysis'), {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                        disabled={processing || !data.start_date || !data.end_date}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                                    >
                                        Apply Date Range
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Current Period Display */}
                        <div className="text-sm text-gray-600">
                            {filters.period === 'custom' ? (
                                <span>Showing data from {new Date(filters.start_date).toLocaleDateString()} to {new Date(filters.end_date).toLocaleDateString()}</span>
                            ) : (
                                <span>Showing data for {filters.period === 'week' ? 'this week' : 
                                                        filters.period === 'month' ? 'this month' : 
                                                        filters.period === 'quarter' ? 'this quarter' : 'this year'}</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                            <p className={`text-2xl font-bold ${category.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.total)}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Average per Period</h3>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.average)}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Transaction Count</h3>
                            <p className="text-2xl font-bold text-gray-700">{summary.transaction_count}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Change from Previous Period</h3>
                            <p className={`text-2xl font-bold ${summary.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.change_percentage}%
                            </p>
                        </div>
                    </div>
                    
                    {/* Trend Chart */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
                        <div className="h-80">
                            <Line 
                                data={trendData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                            labels: {
                                                usePointStyle: true,
                                                boxWidth: 6,
                                                font: {
                                                    weight: 'bold'
                                                }
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    let label = context.dataset.label || '';
                                                    if (label) {
                                                        label += ': ';
                                                    }
                                                    if (context.parsed.y !== null) {
                                                        label += formatCurrency(context.parsed.y);
                                                    }
                                                    return label;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function(value) {
                                                    return formatCurrency(value);
                                                }
                                            },
                                            title: {
                                                display: true,
                                                text: 'Amount'
                                            }
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: trends.interval === 'day' ? 'Day' : 
                                                      trends.interval === 'week' ? 'Week' : 'Month'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Transactions Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(transaction.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.description || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {transactions.length === 0 && (
                                <div className="text-gray-500 text-center py-8">
                                    No transactions found for this period
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}