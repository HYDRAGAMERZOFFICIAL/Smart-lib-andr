import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function IssueReturnIndex({ recentTransactions = [] }) {
    const [activeTab, setActiveTab] = useState('issue');
    const [studentBarcode, setStudentBarcode] = useState('');
    const [bookBarcode, setBookBarcode] = useState('');
    const [returnBookBarcode, setReturnBookBarcode] = useState('');
    const [issueValidation, setIssueValidation] = useState(null);
    const [returnValidation, setReturnValidation] = useState(null);

    const handleValidateIssue = (e) => {
        e.preventDefault();
        router.post(route('issue-return.validate'), {
            student_barcode: studentBarcode,
            book_barcode: bookBarcode,
            type: 'issue'
        }, {
            onSuccess: (response) => {
                setIssueValidation(response.props.validation);
            },
            onError: () => {
                setIssueValidation({ valid: false, message: 'Validation failed' });
            }
        });
    };

    const handleIssueBook = (e) => {
        e.preventDefault();
        router.post(route('issue-return.issue'), {
            student_barcode: studentBarcode,
            book_barcode: bookBarcode
        }, {
            onSuccess: () => {
                setStudentBarcode('');
                setBookBarcode('');
                setIssueValidation(null);
                alert('Book issued successfully');
            },
            onError: () => alert('Error issuing book')
        });
    };

    const handleReturnBook = (e) => {
        e.preventDefault();
        router.post(route('issue-return.return'), {
            book_barcode: returnBookBarcode
        }, {
            onSuccess: () => {
                setReturnBookBarcode('');
                setReturnValidation(null);
                alert('Book returned successfully');
            },
            onError: () => alert('Error returning book')
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Issue & Return Books
                </h2>
            }
        >
            <Head title="Issue/Return" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Tabs */}
                            <div className="mb-6 bg-white rounded-lg shadow-md">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('issue')}
                                        className={`flex-1 px-6 py-4 font-medium text-center border-b-2 transition ${
                                            activeTab === 'issue'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Issue Book
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('return')}
                                        className={`flex-1 px-6 py-4 font-medium text-center border-b-2 transition ${
                                            activeTab === 'return'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Return Book
                                    </button>
                                </div>

                                {/* Issue Tab */}
                                {activeTab === 'issue' && (
                                    <div className="p-6">
                                        <form onSubmit={handleValidateIssue}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Student Library Card / Barcode
                                                </label>
                                                <input
                                                    type="text"
                                                    value={studentBarcode}
                                                    onChange={(e) => setStudentBarcode(e.target.value)}
                                                    placeholder="Scan or enter student barcode"
                                                    autoFocus
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                />
                                            </div>

                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Book Barcode / Copy Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookBarcode}
                                                    onChange={(e) => setBookBarcode(e.target.value)}
                                                    placeholder="Scan or enter book barcode"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg"
                                            >
                                                Validate & Preview
                                            </button>
                                        </form>

                                        {/* Validation Result */}
                                        {issueValidation && (
                                            <div className={`mt-6 p-4 rounded-md ${
                                                issueValidation.valid
                                                    ? 'bg-green-50 border border-green-200'
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <h4 className={`font-medium mb-3 ${
                                                    issueValidation.valid ? 'text-green-900' : 'text-red-900'
                                                }`}>
                                                    {issueValidation.valid ? 'Ready to Issue' : 'Validation Failed'}
                                                </h4>

                                                {issueValidation.student && (
                                                    <div className="mb-3 text-sm text-gray-700">
                                                        <p><strong>Student:</strong> {issueValidation.student.name}</p>
                                                        <p><strong>ID:</strong> {issueValidation.student.id_number}</p>
                                                    </div>
                                                )}

                                                {issueValidation.book && (
                                                    <div className="mb-3 text-sm text-gray-700">
                                                        <p><strong>Book:</strong> {issueValidation.book.title}</p>
                                                        <p><strong>Due Date:</strong> {issueValidation.due_date}</p>
                                                    </div>
                                                )}

                                                {issueValidation.message && (
                                                    <p className="text-sm text-gray-700 mb-4">{issueValidation.message}</p>
                                                )}

                                                {issueValidation.valid && (
                                                    <button
                                                        onClick={handleIssueBook}
                                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                                                    >
                                                        Confirm Issue
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Return Tab */}
                                {activeTab === 'return' && (
                                    <div className="p-6">
                                        <form onSubmit={handleReturnBook}>
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Book Barcode / Copy Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={returnBookBarcode}
                                                    onChange={(e) => setReturnBookBarcode(e.target.value)}
                                                    placeholder="Scan or enter book barcode"
                                                    autoFocus
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-lg"
                                            >
                                                Process Return
                                            </button>
                                        </form>

                                        {/* Return Validation */}
                                        {returnValidation && (
                                            <div className={`mt-6 p-4 rounded-md ${
                                                returnValidation.valid
                                                    ? 'bg-green-50 border border-green-200'
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <h4 className={`font-medium mb-2 ${
                                                    returnValidation.valid ? 'text-green-900' : 'text-red-900'
                                                }`}>
                                                    {returnValidation.message}
                                                </h4>
                                                {returnValidation.fine && (
                                                    <p className="text-sm font-bold text-red-700">
                                                        Fine Amount: ₹{returnValidation.fine}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((trans, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{trans.student_name}</p>
                                            <p className="text-xs text-gray-600">{trans.book_title}</p>
                                            <p className="text-xs font-medium text-gray-700 mt-2">
                                                {trans.type === 'issue' ? '📤 Issued' : '📥 Returned'}
                                            </p>
                                            <p className="text-xs text-gray-500">{new Date(trans.created_at).toLocaleString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No transactions yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
