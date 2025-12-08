import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentProfile({ student = {}, libraryCard = null, activeLoans = 0, totalPendingFines = 0 }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Profile
                </h2>
            }
        >
            <Head title="Student Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {student.photo && (
                                    <div className="mb-4">
                                        <img
                                            src={`/storage/${student.photo}`}
                                            alt={student.name}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{student.id_number}</p>
                                <p className="text-sm text-gray-600">{student.email}</p>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            student.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : student.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}>
                                            {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Active Loans</span>
                                        <span className="text-sm font-bold text-blue-600">{activeLoans}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Pending Fines</span>
                                        <span className="text-sm font-bold text-red-600">₹{totalPendingFines}</span>
                                    </div>
                                </div>

                                <Link
                                    href={route('student.profile.edit')}
                                    className="w-full mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-medium transition"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Name</p>
                                        <p className="text-gray-900">{student.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Student ID</p>
                                        <p className="text-gray-900">{student.id_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email</p>
                                        <p className="text-gray-900">{student.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Course</p>
                                        <p className="text-gray-900">{student.course || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Semester</p>
                                        <p className="text-gray-900">{student.semester || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Phone</p>
                                        <p className="text-gray-900">{student.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Address</p>
                                        <p className="text-gray-900">{student.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Guardian Information */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Guardian Name</p>
                                        <p className="text-gray-900">{student.guardian_name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Guardian Phone</p>
                                        <p className="text-gray-900">{student.guardian_phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Library Card */}
                            {libraryCard && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Library Card</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Card Number</p>
                                            <p className="text-gray-900 font-mono">{libraryCard.card_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Issued Date</p>
                                            <p className="text-gray-900">{new Date(libraryCard.issued_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Expiry Date</p>
                                            <p className="text-gray-900">{new Date(libraryCard.expiry_date).toLocaleDateString()}</p>
                                        </div>
                                        <Link
                                            href={route('library-card.show')}
                                            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition"
                                        >
                                            View Card Details
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
