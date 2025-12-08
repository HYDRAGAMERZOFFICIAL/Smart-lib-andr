import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function NotificationsIndex({ notifications = {} }) {
    const notificationsList = notifications.data ? Array.isArray(notifications.data) ? notifications.data : [notifications.data] : [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Notifications
                </h2>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {notificationsList.length > 0 ? (
                            notificationsList.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-lg shadow-md p-6 ${
                                        notification.read_at
                                            ? 'bg-gray-50 border border-gray-200'
                                            : 'bg-blue-50 border border-blue-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-600 mt-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-3">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.read_at && (
                                            <span className="ml-4 flex-shrink-0 inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                                                New
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                                <p className="mt-2 text-gray-600">You're all caught up!</p>
                            </div>
                        )}
                    </div>

                    {notificationsList.length > 0 && (
                        <div className="mt-6">
                            <Link
                                href={route('notifications.history')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View All Notifications →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
