import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function LibraryCardShow({ card = {} }) {
    const [showRequest, setShowRequest] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestNewCard = () => {
        setIsSubmitting(true);
        router.post(route('library-card.request'), {}, {
            onFinish: () => setIsSubmitting(false),
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
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Main Card Display */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition hover:shadow-3xl">
                            {/* Card Front - Colorful Design */}
                            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <p className="text-sm opacity-90 mb-2 font-semibold tracking-widest">LIBRARY CARD</p>
                                        <p className="text-4xl font-bold font-mono tracking-wider">{card.card_number}</p>
                                    </div>
                                    <div className="text-right bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                                        <p className="text-xs opacity-90 uppercase tracking-wide">Expires</p>
                                        <p className="text-lg font-bold">
                                            {new Date(card.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Student Information */}
                                <div className="flex justify-between items-end mb-8 relative z-10">
                                    <div className="flex-1">
                                        <p className="text-xs opacity-80 mb-2 uppercase tracking-wide">Student Name</p>
                                        <p className="text-2xl font-bold mb-3">{card.student_name}</p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-xs opacity-80">Student ID</p>
                                                <p className="text-sm font-mono">{card.student_id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* QR Code */}
                                    {card.qr_code && (
                                        <div className="bg-white p-3 rounded-lg shadow-lg ml-6">
                                            <img
                                                src={card.qr_code}
                                                alt="QR Code"
                                                className="w-28 h-28"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Barcode Section - Large and Visible */}
                                {card.barcode && (
                                    <div className="mt-8 bg-white bg-opacity-95 p-4 rounded-lg relative z-10">
                                        <p className="text-center text-gray-800 text-xs font-semibold mb-2 uppercase tracking-wide">Card Number Barcode</p>
                                        <div className="flex justify-center">
                                            <img
                                                src={card.barcode}
                                                alt="Barcode"
                                                className="h-16 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Back / Details Section */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column - Dates and Info */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 pb-3 border-b-2 border-indigo-600">Card Information</h3>
                                        
                                        <div className="space-y-5">
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Issued Date</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {new Date(card.issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Expiry Date</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {new Date(card.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Photo and Status */}
                                    <div>
                                        {card.photo ? (
                                            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Student Photo</p>
                                                <img
                                                    src={card.photo}
                                                    alt="Student"
                                                    className="w-32 h-40 object-cover rounded-md mx-auto border-4 border-indigo-100 shadow-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Photo</p>
                                                <div className="w-32 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-md mx-auto flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Important Notice */}
                                <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-amber-700">⚠️ Important:</span> Please keep this card safe. It is required for library access and book issuance. Report loss or damage immediately to the library administrator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Card
                            </button>
                            
                            <button
                                onClick={() => setShowRequest(!showRequest)}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Request New Card
                            </button>

                            <Link
                                href={route('student.profile')}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-center no-underline"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Profile
                            </Link>
                        </div>

                        {/* Request New Card Modal */}
                        {showRequest && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Request New Library Card</h3>
                                <p className="text-gray-700 mb-6">
                                    This will request a replacement library card from the administration. You will receive a notification once your new card is ready.
                                </p>
                                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-semibold">Note:</span> Requests are typically processed within 2-3 business days.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleRequestNewCard}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm Request'}
                                    </button>
                                    <button
                                        onClick={() => setShowRequest(false)}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
