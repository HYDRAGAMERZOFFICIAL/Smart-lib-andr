import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function StudentIndex({ students = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const filteredStudents = useMemo(() => {
        let filtered = students;

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.id_number?.includes(searchTerm) ||
                s.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(s => s.status === filterStatus);
        }

        if (filterDepartment !== 'all') {
            filtered = filtered.filter(s => s.department === filterDepartment);
        }

        filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name?.localeCompare(b.name);
            if (sortBy === 'id') return a.id_number?.localeCompare(b.id_number);
            if (sortBy === 'department') return a.department?.localeCompare(b.department);
            return 0;
        });

        return filtered;
    }, [students, searchTerm, filterStatus, filterDepartment, sortBy]);

    const handleApprove = (studentId) => {
        if (confirm('Approve this student?')) {
            router.post(route('students.approve', studentId), {}, {
                onError: () => alert('Error approving student')
            });
        }
    };

    const handleReject = (studentId) => {
        if (confirm('Reject this student?')) {
            router.post(route('students.reject', studentId), {}, {
                onError: () => alert('Error rejecting student')
            });
        }
    };

    const handleBlock = (studentId, isBlocked) => {
        if (confirm(`${isBlocked ? 'Unblock' : 'Block'} this student?`)) {
            router.post(isBlocked ? route('students.unblock', studentId) : route('students.block', studentId), {}, {
                onError: () => alert('Error updating student status')
            });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
            blocked: 'bg-gray-100 text-gray-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Student Management
                </h2>
            }
        >
            <Head title="Students" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters Section */}
                    <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters & Search</h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Name, ID, or Email"
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
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="ME">ME</option>
                                    <option value="CE">CE</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="name">Name</option>
                                    <option value="id">ID Number</option>
                                    <option value="department">Department</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredStudents.length} of {students.length} students
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID Number</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.id_number}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{student.department}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    <Link
                                                        href={route('students.show', student.id)}
                                                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                                                    >
                                                        View
                                                    </Link>

                                                    {student.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(student.id)}
                                                                className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(student.id)}
                                                                className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {student.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleBlock(student.id, false)}
                                                            className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                                                        >
                                                            Block
                                                        </button>
                                                    )}

                                                    {student.status === 'blocked' && (
                                                        <button
                                                            onClick={() => handleBlock(student.id, true)}
                                                            className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                                                        >
                                                            Unblock
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No students found
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
