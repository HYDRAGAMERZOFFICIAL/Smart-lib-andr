import React from 'react';
import Layout from '@/layouts/Layout';

export default function Card() {
  const card = null; // To be populated with data

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Library Card</h2>

        {card ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-lg text-white mb-6">
              <p className="text-sm opacity-75 mb-4">Smart Library Card</p>
              <p className="text-2xl font-bold mb-8">•••• •••• •••• {card.cardNumber.slice(-4)}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-75">Card Holder</p>
                  <p className="font-semibold">{card.holderName}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Expires</p>
                  <p className="font-semibold">{card.expiryDate}</p>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mb-2">
              Download as PDF
            </button>
            <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              View QR Code
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No library card found.</p>
        )}
      </div>
    </Layout>
  );
}
