import React from 'react';
import Layout from '@/layouts/Layout';

export default function Calendar() {
  const events = []; // To be populated with data

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Academic Calendar</h2>

        <div className="bg-white p-6 rounded-lg shadow">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event.id} className="p-4 border-l-4 border-indigo-600 bg-gray-50 rounded">
                  <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      event.type === 'holiday' ? 'bg-red-100 text-red-800' :
                      event.type === 'exam' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-gray-600 text-sm">{event.startDate} - {event.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events scheduled yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
