import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { IssuedBook } from '@/types';

interface LoansProps {
  loans: IssuedBook[];
  stats: {
    activeLoanCount: number;
    overdueLoanCount: number;
    totalOutstandingFines: number;
  };
}

export default function Loans({ loans = [], stats = { activeLoanCount: 0, overdueLoanCount: 0, totalOutstandingFines: 0 } }: LoansProps) {
  const [filter, setFilter] = useState('all');

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date() && !dueDate;
  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      issued: 'bg-blue-100 text-blue-700 border-blue-300',
      returned: 'bg-green-100 text-green-700 border-green-300',
      overdue: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const filteredLoans = filter === 'all' 
    ? loans 
    : loans.filter(loan => loan.status === filter);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
          <p className="text-gray-600 mt-2">Track your borrowed books and due dates</p>
        </div>

        {loans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Active Loans</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeLoanCount}</p>
                </div>
                <div className="text-4xl text-blue-600 opacity-20">📖</div>
              </div>
            </div>

            <div className={`rounded-lg shadow-sm border p-6 ${
              stats.overdueLoanCount > 0 
                ? 'bg-red-50 border-red-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold mb-1 ${
                    stats.overdueLoanCount > 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>Overdue Books</p>
                  <p className={`text-3xl font-bold ${
                    stats.overdueLoanCount > 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>{stats.overdueLoanCount}</p>
                </div>
                <div className={`text-4xl opacity-20 ${
                  stats.overdueLoanCount > 0 ? 'text-red-600' : 'text-gray-600'
                }`}>⏰</div>
              </div>
            </div>

            <div className={`rounded-lg shadow-sm border p-6 ${
              stats.totalOutstandingFines > 0 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold mb-1 ${
                    stats.totalOutstandingFines > 0 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>Outstanding Fines</p>
                  <p className={`text-3xl font-bold ${
                    stats.totalOutstandingFines > 0 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>₹{stats.totalOutstandingFines}</p>
                </div>
                <div className={`text-4xl opacity-20 ${
                  stats.totalOutstandingFines > 0 ? 'text-yellow-600' : 'text-gray-600'
                }`}>💰</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('issued')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'issued'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Issued
              </button>
              <button
                onClick={() => setFilter('returned')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'returned'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Returned
              </button>
            </div>
          </div>

          {filteredLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Book Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issued Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Returned Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLoans.map((loan: IssuedBook) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{loan.book?.title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{loan.book?.author || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(loan.issued_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(loan.due_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {loan.returned_date 
                          ? new Date(loan.returned_date).toLocaleDateString('en-IN')
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(loan.status)}`}>
                          {loan.status === 'issued' && '📖'} {loan.status === 'returned' && '✓'} {loan.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${loan.fine ? 'text-red-600' : 'text-gray-600'}`}>
                        ₹{loan.fine || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                {loans.length === 0 
                  ? 'No loans yet. Start borrowing books!' 
                  : 'No loans match your filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
