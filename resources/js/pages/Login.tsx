import React, { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data, setData, post, processing } = useForm({
    idNumber: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    post('/login', {
      onError: (errors: any) => {
        setErrors(errors);
        toast.error('Login failed. Please check your credentials.');
      },
      onSuccess: () => {
        toast.success('Login successful!');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Smart Library</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={processing}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {processing ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
