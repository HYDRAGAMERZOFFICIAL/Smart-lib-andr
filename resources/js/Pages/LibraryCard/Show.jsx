import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LibraryCardShow({ card = {} }) {
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
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Card Body */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-sm opacity-80 mb-2">Library Card</p>
                                    <p className="text-3xl font-bold font-mono">{card.card_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-80">Valid</p>
                                    <p className="text-sm font-semibold">
                                        {new Date(card.expiry_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-80 mb-1">Student Name</p>
                                    <p className="text-lg font-semibold">{card.student_name}</p>
                                    <p className="text-sm opacity-90 mt-2">{card.student_id}</p>
                                </div>
                                {card.qr_code && (
                                    <div className="bg-white p-2 rounded">
                                        <img
                                            src={card.qr_code}
                                            alt="QR Code"
                                            className="w-24 h-24"
                                        />
                                    </div>
                                )}
                            </div>

                            {card.barcode && (
                                <div className="mt-8 flex justify-center">
                                    <img
                                        src={card.barcode}
                                        alt="Barcode"
                                        className="h-12"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Issued Date</p>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(card.issued_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Expiry Date</p>
                                    <p className="text-gray-900 mt-1">
                                        {new Date(card.expiry_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {card.photo && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Photo</p>
                                    <img
                                        src={card.photo}
                                        alt="Student"
                                        className="w-24 h-32 object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="border-t pt-4 mt-4">
                                <p className="text-sm text-gray-600 text-center">
                                    Please keep this card safe. It is required for library access and book issuance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
                        >
                            Print Card
                        </button>
                        <Link
                            href={route('student.profile')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition text-center"
                        >
                            Back to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
