import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function NotificationsHistory({ notifications = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const notificationsList = notifications.data ? Array.isArray(notifications.data) ? notifications.data : [notifications.data] : [];

    const filteredNotifications = useMemo(() => {
        let filtered = notificationsList;

        if (searchTerm) {
            filtered = filtered.filter(n =>
                n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter) {
            filtered = filtered.filter(n => n.type === typeFilter);
        }

        return filtered;
    }, [notificationsList, searchTerm, typeFilter]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'announcement':
                return 'bg-blue-100 text-blue-800';
            case 'reminder':
                return 'bg-yellow-100 text-yellow-800';
            case 'alert':
                return 'bg-red-100 text-red-800';
            case 'success':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Notification History
                </h2>
            }
        >
            <Head title="Notification History" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Title or message..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex-1 md:ml-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="alert">Alert</option>
                                    <option value="success">Success</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                    {notification.type?.charAt(0).toUpperCase() + notification.type?.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-3">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications found</h3>
                                <p className="mt-2 text-gray-600">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('notifications.index')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Notifications
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
