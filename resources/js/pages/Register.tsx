import React, { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Register() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data, setData, post, processing } = useForm({
    fullName: '',
    idNumber: '',
    phone: '',
    department: '',
    semester: '',
    password: '',
    password_confirmation: '',
  });

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    post('/register', {
      onError: (errors: any) => {
        setErrors(errors);
        toast.error('Registration failed. Please check your inputs.');
      },
      onSuccess: () => {
        toast.success('Registration successful! Awaiting approval.');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Smart Library</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => setData('fullName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">ID Number</label>
            <input
              type="text"
              value={data.idNumber}
              onChange={(e) => setData('idNumber', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Department</label>
            <select
              value={data.department}
              onChange={(e) => setData('department', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Semester</label>
            <select
              value={data.semester}
              onChange={(e) => setData('semester', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.semester ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
            {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={processing}
            />
            {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {processing ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
