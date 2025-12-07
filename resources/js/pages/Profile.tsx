import React, { FormEvent, useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function Profile() {
  const page = usePage();
  const user = page.props.auth?.user as User;
  const [isEditing, setIsEditing] = useState(false);
  const { data, setData, put, processing } = useForm({
    phone: user.phone || '',
    department: user.department || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put('/profile', {
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update profile.');
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">My Profile</h2>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-600">{user.idNumber}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-800 font-semibold">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-800 font-semibold">{user.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Department</p>
                <p className="text-gray-800 font-semibold">{user.department}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Semester</p>
                <p className="text-gray-800 font-semibold">{user.semester}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`font-semibold ${user.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isApproved ? 'Approved' : 'Pending Approval'}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={processing}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Department</label>
                <input
                  type="text"
                  value={data.department}
                  onChange={(e) => setData('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={processing}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
