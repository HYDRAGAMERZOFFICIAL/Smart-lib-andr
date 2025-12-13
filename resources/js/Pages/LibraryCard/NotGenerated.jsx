import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function LibraryCardNotGenerated() {
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequestCard = () => {
        setIsRequesting(true);
        router.post(route('library-card.request'), {}, {
            onFinish: () => setIsRequesting(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Library Card
                </h2>
            }
        >
            <Head title="Library Card" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-xl overflow-hidden border border-indigo-200">
                        <div className="p-8 md:p-12">
                            <div className="text-center">
                                {/* Icon */}
                                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>

                                <h3 className="text-3xl font-bold text-gray-900 mb-3">Library Card Not Generated</h3>
                                <p className="text-gray-700 text-lg mb-8">
                                    Your library card is not yet available. Here are some possible reasons:
                                </p>

                                {/* Reasons */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
                                        <div className="flex items-start">
                                            <svg className="w-6 h-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zm-2-9a9 9 0 00-7.167 14.97c.211.48.33.974.348 1.465a1 1 0 11-2 .066C5.147 13.858 9 9.517 9 5a4 4 0 118 0c0 4.517 3.853 8.858 1.848 13.468a1 1 0 11-2-.066c.018-.49.137-.985.348-1.465A9 9 0 0016 -1z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-800">Pending Approval</p>
                                                <p className="text-sm text-gray-600">Your account is awaiting administrator approval</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                                        <div className="flex items-start">
                                            <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-800">Account Rejected</p>
                                                <p className="text-sm text-gray-600">Your account registration was rejected</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                                        <div className="flex items-start">
                                            <svg className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 112.5 9a1 1 0 100-2A8 8 0 1015.464 13.536A1 1 0 0013.477 14.89z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-gray-800">Processing Issue</p>
                                                <p className="text-sm text-gray-600">There was an issue generating your card</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Box */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-8">
                                    <p className="text-gray-800 mb-4">
                                        <span className="font-bold text-green-700">💡 Request a Library Card:</span> If you believe your card should have been generated, you can request a new one from the administration.
                                    </p>
                                    <button
                                        onClick={handleRequestCard}
                                        disabled={isRequesting}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 inline-flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {isRequesting ? 'Requesting...' : 'Request Library Card'}
                                    </button>
                                </div>

                                {/* Contact Message */}
                                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-8">
                                    <p className="text-blue-900">
                                        <span className="font-bold">📞 Need Help?</span> Please contact the library administrator if you have any questions or need assistance.
                                    </p>
                                </div>

                                {/* Navigation */}
                                <Link
                                    href={route('student.profile')}
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-semibold transition transform hover:scale-105 shadow-lg no-underline flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
