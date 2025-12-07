import React from 'react';
import Layout from '@/layouts/Layout';

export default function Loans() {
  const loans = []; // To be populated with data

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">My Loans</h2>

        <div className="bg-white p-6 rounded-lg shadow">
          {loans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Book Title</th>
                    <th className="px-6 py-3 text-left font-semibold">Issued Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan: any) => (
                    <tr key={loan.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{loan.bookTitle}</td>
                      <td className="px-6 py-4">{loan.issuedDate}</td>
                      <td className="px-6 py-4">{loan.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          loan.status === 'issued' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">₹{loan.fine || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No loans yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
