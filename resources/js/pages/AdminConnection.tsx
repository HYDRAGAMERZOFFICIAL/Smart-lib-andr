import React from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { AdminConnection } from '@/types';

interface AdminConnectionProps {
  connection: AdminConnection;
}

export default function AdminConnectionPage({ connection }: AdminConnectionProps) {
  const page = usePage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel Connection</h1>
          <p className="text-gray-600 mt-2">Monitor your data synchronization with the admin panel</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Connection Status</h2>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
              connection.enabled 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connection.enabled ? 'bg-green-600' : 'bg-gray-600'}`}></span>
              {connection.enabled ? 'Connected' : 'Not Connected'}
            </div>
          </div>

          {connection.enabled && connection.url && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Connected to:</span> {connection.url}
              </p>
            </div>
          )}

          {connection.lastSync && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Last Sync:</span> {new Date(connection.lastSync).toLocaleString()}
              </p>
            </div>
          )}

          {!connection.enabled && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Waiting for Setup:</span> Your data will be synced once the admin panel is connected. No action needed from your side.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Tracking</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Student Enrollment</p>
                <p className="text-sm text-gray-600">Your account creation and status</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connection.dataTracking.studentEnrollment 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {connection.dataTracking.studentEnrollment ? '✓ Tracked' : 'Not Tracked'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Book Loans</p>
                <p className="text-sm text-gray-600">Books you borrow from the library</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connection.dataTracking.bookLoans 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {connection.dataTracking.bookLoans ? '✓ Tracked' : 'Not Tracked'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Book Returns</p>
                <p className="text-sm text-gray-600">Books you return to the library</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connection.dataTracking.bookReturns 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {connection.dataTracking.bookReturns ? '✓ Tracked' : 'Not Tracked'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Fines & Payments</p>
                <p className="text-sm text-gray-600">Outstanding fines and payment records</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connection.dataTracking.fines 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {connection.dataTracking.fines ? '✓ Tracked' : 'Not Tracked'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Information</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Your data is secure and only shared with authorized admin panels</li>
            <li>✓ All tracking is transparent and documented on this page</li>
            <li>✓ You can view what data is being tracked in real-time</li>
            <li>✓ Connection credentials are safely stored in the system</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
