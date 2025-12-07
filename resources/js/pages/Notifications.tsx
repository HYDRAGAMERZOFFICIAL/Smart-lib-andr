import React from 'react';
import Layout from '@/layouts/Layout';

export default function Notifications() {
  const notifications = []; // To be populated with data

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Notifications</h2>

        <div className="bg-white p-6 rounded-lg shadow">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif: any) => (
                <div key={notif.id} className={`p-4 rounded-lg border ${
                  notif.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{notif.body}</p>
                      <p className="text-gray-400 text-xs mt-2">{notif.createdAt}</p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-3 h-3 bg-blue-600 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No notifications yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
