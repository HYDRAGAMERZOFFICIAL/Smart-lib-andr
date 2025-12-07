import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportsIndex() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exportFormat, setExportFormat] = useState('csv');

    const reports = [
        {
            id: 'issued-books',
            title: 'Issued Books Report',
            description: 'View all books issued within a date range',
            icon: '📤'
        },
        {
            id: 'returned-books',
            title: 'Returned Books Report',
            description: 'View all books returned within a date range',
            icon: '📥'
        },
        {
            id: 'overdue',
            title: 'Overdue Books Report',
            description: 'View all overdue books and fines',
            icon: '🔴'
        },
        {
            id: 'student-wise',
            title: 'Student-wise Report',
            description: 'Borrowing activity per student',
            icon: '👥'
        },
        {
            id: 'book-wise',
            title: 'Book-wise Report',
            description: 'Borrowing statistics per book',
            icon: '📚'
        },
        {
            id: 'fine-collection',
            title: 'Fine Collection Report',
            description: 'Outstanding and collected fines',
            icon: '💰'
        }
    ];

    const handleGenerateReport = (reportId) => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        const reportRoute = `reports.${reportId}`;
        router.get(route(reportRoute), {
            start_date: startDate,
            end_date: endDate
        });
    };

    const handleExport = (reportId) => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        router.post(route('reports.export'), {
            report_type: reportId,
            start_date: startDate,
            end_date: endDate,
            format: exportFormat
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Reports & Analytics
                </h2>
            }
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Date Range Selection */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date Range</h3>
                        
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="csv">CSV</option>
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Reports Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => setSelectedReport(report.id)}
                            >
                                <div className="text-4xl mb-3">{report.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleGenerateReport(report.id)}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleExport(report.id)}
                                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Link
                                href={route('loans.due-soon')}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-center font-medium"
                            >
                                Books Due Soon
                            </Link>
                            <Link
                                href={route('loans.overdue')}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center font-medium"
                            >
                                Overdue Books
                            </Link>
                        </div>
                    </div>

                    {/* Report Examples */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Report Types</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">1.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Issued Books Report</p>
                                    <p className="text-sm text-gray-600">Complete list of books issued within selected dates with student details</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">2.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Returned Books Report</p>
                                    <p className="text-sm text-gray-600">Complete list of books returned within selected dates</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">3.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Overdue Books Report</p>
                                    <p className="text-sm text-gray-600">All currently overdue books with student contact and fine details</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">4.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Student-wise Report</p>
                                    <p className="text-sm text-gray-600">Borrowing statistics and activity per student</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">5.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Book-wise Report</p>
                                    <p className="text-sm text-gray-600">Most borrowed books and availability statistics</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-bold mr-3">6.</span>
                                <div>
                                    <p className="font-medium text-gray-900">Fine Collection Report</p>
                                    <p className="text-sm text-gray-600">Outstanding fines, collected fines, and payment details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
