import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function LibraryCardsIndex({ cards = [], students = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');

    const filteredCards = useMemo(() => {
        let filtered = cards;

        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.card_number?.includes(searchTerm) ||
                c.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.student_id_number?.includes(searchTerm)
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }

        return filtered;
    }, [cards, searchTerm, filterStatus]);

    const handleGenerateCard = () => {
        if (!selectedStudent) {
            alert('Please select a student');
            return;
        }

        router.post(route('library-cards.generate', selectedStudent), {}, {
            onSuccess: () => {
                setShowGenerateModal(false);
                setSelectedStudent('');
                alert('Library card generated successfully');
            },
            onError: () => alert('Error generating library card')
        });
    };

    const handleReissueCard = (cardId) => {
        if (confirm('Reissue this library card?')) {
            router.post(route('library-cards.reissue', cardId), {}, {
                onSuccess: () => alert('Library card reissued successfully'),
                onError: () => alert('Error reissuing library card')
            });
        }
    };

    const handlePrintCard = (cardId) => {
        window.open(route('library-cards.print', cardId), '_blank');
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            lost: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Library Card Management
                </h2>
            }
        >
            <Head title="Library Cards" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Action Button */}
                    <div className="mb-6 flex gap-3">
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            Generate New Card
                        </button>
                    </div>

                    {/* Generate Modal */}
                    {showGenerateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Library Card</h3>
                                
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select a Student</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.id_number})
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerateCard}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                    >
                                        Generate
                                    </button>
                                    <button
                                        onClick={() => setShowGenerateModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Card Number, Student Name, or ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredCards.length} of {cards.length} cards
                        </div>
                    </div>

                    {/* Cards Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Card Number</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issued Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCards.length > 0 ? (
                                        filteredCards.map((card) => (
                                            <tr key={card.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{card.card_number}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{card.student_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{card.student_id_number}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(card.status)}`}>
                                                        {card.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(card.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    <button
                                                        onClick={() => handlePrintCard(card.id)}
                                                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                                                    >
                                                        Print
                                                    </button>

                                                    {card.status === 'lost' && (
                                                        <button
                                                            onClick={() => handleReissueCard(card.id)}
                                                            className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                                                        >
                                                            Reissue
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No library cards found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
