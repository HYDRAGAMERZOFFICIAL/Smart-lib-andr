import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function IncomeVsExpense({ auth, filters, summary, monthlyData, categoryBreakdown, chartData }) {
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Prepare data for charts
    const barChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Income',
                data: chartData.income,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Expenses',
                data: chartData.expense,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ]
    };
    
    const lineChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Savings',
                data: chartData.savings,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.1,
            }
        ]
    };
    
    // Get available years for filter
    const currentYear = new Date().getFullYear();
    const availableYears = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
        availableYears.push(i);
    }
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Income vs Expense Analysis</h2>}
        >
            <Head title="Income vs Expense Analysis" />

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
                    
                    {/* Year Filter */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Select Year</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableYears.map(year => (
                                <Link
                                    key={year}
                                    href={route('reports.income-vs-expense', { year })}
                                    className={`px-4 py-2 rounded-lg ${parseInt(filters.year) === year ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {year}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.expense)}</p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Savings</h3>
                            <p className={`text-2xl font-bold ${summary.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.savings)}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500">Savings Rate</h3>
                            <p className={`text-2xl font-bold ${summary.savings_rate >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {summary.savings_rate}%
                            </p>
                        </div>
                    </div>
                    
                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
                            <div className="h-80">
                                <Bar 
                                    data={barChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Monthly Savings Trend</h3>
                            <div className="h-80">
                                <Line 
                                    data={lineChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: false
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Monthly Breakdown Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Savings Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyData.map((month, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(month.income)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(month.expense)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                <span className={month.savings >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {formatCurrency(month.savings)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                <span className={month.savings_rate >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {month.savings_rate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Category Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Income Categories</h3>
                            <div className="space-y-4">
                                {categoryBreakdown
                                    .filter(cat => cat.type === 'income')
                                    .sort((a, b) => b.total - a.total)
                                    .map((category) => (
                                        <div key={category.category_id} className="flex items-center">
                                            <div 
                                                className="w-4 h-4 rounded-full mr-2" 
                                                style={{ backgroundColor: category.category_color }}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{category.category_name}</span>
                                                    <span>{formatCurrency(category.total)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                    <div 
                                                        className="bg-green-600 h-2.5 rounded-full" 
                                                        style={{ width: `${category.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-right mt-1 text-gray-500">
                                                    {category.percentage}% of total income
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                
                                {categoryBreakdown.filter(cat => cat.type === 'income').length === 0 && (
                                    <div className="text-gray-500 text-center py-8">
                                        No income data available
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
                            <div className="space-y-4">
                                {categoryBreakdown
                                    .filter(cat => cat.type === 'expense')
                                    .sort((a, b) => b.total - a.total)
                                    .map((category) => (
                                        <div key={category.category_id} className="flex items-center">
                                            <div 
                                                className="w-4 h-4 rounded-full mr-2" 
                                                style={{ backgroundColor: category.category_color }}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{category.category_name}</span>
                                                    <span>{formatCurrency(category.total)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                    <div 
                                                        className="bg-red-600 h-2.5 rounded-full" 
                                                        style={{ width: `${category.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-right mt-1 text-gray-500">
                                                    {category.percentage}% of total expenses
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                
                                {categoryBreakdown.filter(cat => cat.type === 'expense').length === 0 && (
                                    <div className="text-gray-500 text-center py-8">
                                        No expense data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}