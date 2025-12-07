import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { User } from '@/types';

interface DashboardProps {
  stats: {
    activeLoans: number;
    overdueBooks: number;
    totalFines: number;
    recentBooks: any[];
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const page = usePage();
  const user = page.props.auth?.user as User;

  const getStatusColor = (count: number, type: string) => {
    if (type === 'active') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (type === 'overdue' && count > 0) return 'bg-red-50 text-red-600 border-red-200';
    if (type === 'fines' && parseFloat(stats.totalFines) > 0) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(stats.activeLoans, 'active')} bg-blue-50`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Active Loans</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeLoans}</p>
              </div>
              <div className="text-4xl text-blue-600 opacity-20">📚</div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 ${stats.overdueBooks > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold mb-1 ${stats.overdueBooks > 0 ? 'text-red-600' : 'text-gray-600'}`}>Overdue Books</p>
                <p className={`text-3xl font-bold ${stats.overdueBooks > 0 ? 'text-red-600' : 'text-gray-600'}`}>{stats.overdueBooks}</p>
              </div>
              <div className={`text-4xl opacity-20 ${stats.overdueBooks > 0 ? 'text-red-600' : 'text-gray-600'}`}>⏰</div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 ${parseFloat(stats.totalFines) > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold mb-1 ${parseFloat(stats.totalFines) > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>Outstanding Fines</p>
                <p className={`text-3xl font-bold ${parseFloat(stats.totalFines) > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>₹{stats.totalFines}</p>
              </div>
              <div className={`text-4xl opacity-20 ${parseFloat(stats.totalFines) > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>💰</div>
            </div>
          </div>

          <Link href="/books" className="p-6 rounded-lg border-2 border-indigo-200 bg-indigo-50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-semibold mb-1">Browse Books</p>
                <p className="text-3xl font-bold text-indigo-600">→</p>
              </div>
              <div className="text-4xl opacity-20 text-indigo-600">🔍</div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link href="/loans" className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow border border-blue-200">
                <p className="font-semibold text-gray-900">My Loans</p>
                <p className="text-sm text-gray-600">View and manage your borrowed books</p>
              </Link>
              <Link href="/card" className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow border border-purple-200">
                <p className="font-semibold text-gray-900">Library Card</p>
                <p className="text-sm text-gray-600">Check your library card details</p>
              </Link>
              <Link href="/profile" className="block p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-shadow border border-green-200">
                <p className="font-semibold text-gray-900">My Profile</p>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user.is_approved ? '✓ Approved' : '⏳ Pending Approval'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">ID Number</span>
                <span className="font-semibold text-gray-900">{user.id_number}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Department</span>
                <span className="font-semibold text-gray-900">{user.department}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Semester</span>
                <span className="font-semibold text-gray-900">{user.semester}</span>
              </div>
            </div>
          </div>
        </div>

        {stats.recentBooks.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Added Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentBooks.map((book) => (
                <Link key={book.id} href={`/books/${book.id}`} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{book.author}</p>
                  <p className="text-indigo-600 font-semibold text-sm mt-3">
                    {book.availableCopies} available
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
