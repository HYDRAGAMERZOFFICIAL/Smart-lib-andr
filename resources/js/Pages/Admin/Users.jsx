import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Users({ users }) {
    const [processing, setProcessing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        password_confirmation: '',
        role: 'member'
    });
    const [errors, setErrors] = useState({});

    // Reset form data when modals are closed
    useEffect(() => {
        if (!showCreateModal && !showEditModal) {
            setFormData({
                name: '',
                email: '',
                mobile: '',
                password: '',
                password_confirmation: '',
                role: 'member'
            });
            setErrors({});
        }
    }, [showCreateModal, showEditModal]);

    const handleRoleChange = (userId, newRole) => {
        if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            setProcessing(true);
            router.post(route('admin.users.update-role'), { 
                userId, 
                role: newRole 
            }, {
                onSuccess: () => setProcessing(false),
                onError: () => {
                    setProcessing(false);
                    alert('An error occurred while updating the user role.');
                }
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile || '',
            password: '',
            password_confirmation: '',
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post(route('admin.users.store'), formData, {
            onSuccess: () => {
                setProcessing(false);
                setShowCreateModal(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post(route('admin.users.update'), formData, {
            onSuccess: () => {
                setProcessing(false);
                setShowEditModal(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            }
        });
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setProcessing(true);
            
            router.delete(route('admin.users.destroy'), {
                data: { id: userId },
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                    alert('An error occurred while deleting the user.');
                }
            });
        }
    };
    
    const handleImpersonate = (userId) => {
        if (confirm('Are you sure you want to login as this user?')) {
            setProcessing(true);
            
            router.post(route('admin.users.impersonate'), { 
                userId 
            }, {
                onError: () => {
                    setProcessing(false);
                    alert('An error occurred while trying to impersonate this user.');
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manage Users
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Create New User
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Verified
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {user.photo ? (
                                                            <img className="h-10 w-10 rounded-full" src={`/storage/${user.photo}`} alt="" />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                                <span className="text-sm font-medium text-gray-500">{user.name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        {user.mobile && (
                                                            <div className="text-sm text-gray-500">{user.mobile}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'Member'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {user.email_verified_at ? (
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                                                        Not Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <select
                                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        disabled={processing}
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                                        disabled={processing}
                                                    >
                                                        Edit
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                                                        disabled={processing}
                                                    >
                                                        Delete
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleImpersonate(user.id)}
                                                        className="rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                                                        disabled={processing}
                                                    >
                                                        Login As
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New User</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile (Optional)</label>
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        id="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                    {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        name="password_confirmation"
                                                        id="password_confirmation"
                                                        value={formData.password_confirmation}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                                    <select
                                                        name="role"
                                                        id="role"
                                                        value={formData.role}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create User'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && currentUser && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <form onSubmit={handleEditSubmit}>
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">Edit User: {currentUser.name}</h3>
                                            <div className="mt-4 space-y-4">
                                                <input type="hidden" name="id" value={formData.id} />
                                                
                                                <div>
                                                    <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="edit_name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="edit_email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="edit_mobile" className="block text-sm font-medium text-gray-700">Mobile (Optional)</label>
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        id="edit_mobile"
                                                        value={formData.mobile}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                    {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700">
                                                        Password (Leave blank to keep current password)
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="edit_password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="edit_password_confirmation" className="block text-sm font-medium text-gray-700">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password_confirmation"
                                                        id="edit_password_confirmation"
                                                        value={formData.password_confirmation}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="edit_role" className="block text-sm font-medium text-gray-700">Role</label>
                                                    <select
                                                        name="role"
                                                        id="edit_role"
                                                        value={formData.role}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setShowEditModal(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}