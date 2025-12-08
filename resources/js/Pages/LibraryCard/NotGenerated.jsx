import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LibraryCardNotGenerated() {
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
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center">
                            <div className="mb-6">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Library Card Not Generated</h3>
                            <p className="text-gray-600 mb-8">
                                Your library card has not been generated yet. This may be because:
                            </p>

                            <ul className="text-left bg-gray-50 rounded-lg p-6 mb-8 space-y-3">
                                <li className="flex items-start">
                                    <span className="text-gray-400 mr-3">•</span>
                                    <span className="text-gray-700">Your account is still pending approval</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-400 mr-3">•</span>
                                    <span className="text-gray-700">Your account has been rejected</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-400 mr-3">•</span>
                                    <span className="text-gray-700">There was an issue during card generation</span>
                                </li>
                            </ul>

                            <p className="text-gray-600 mb-8">
                                Please contact the library administrator if you believe this is an error.
                            </p>

                            <Link
                                href={route('student.profile')}
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                            >
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
