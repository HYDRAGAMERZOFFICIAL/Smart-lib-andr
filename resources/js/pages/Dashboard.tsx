import React from 'react';
import { usePage } from '@inertiajs/react';
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold">Active Loans</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.activeLoans}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold">Overdue Books</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.overdueBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-semibold">Total Fines</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">₹{stats.totalFines}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recently Added Books</h3>
          <div className="space-y-4">
            {stats.recentBooks.length > 0 ? (
              stats.recentBooks.map((book) => (
                <div key={book.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-semibold text-gray-800">{book.title}</h4>
                    <p className="text-gray-600 text-sm">{book.author}</p>
                  </div>
                  <span className="text-indigo-600 font-semibold">{book.availableCopies} available</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No books available yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
