import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
  const page = usePage();
  const user = page.props.auth?.user;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Smart Library</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-gray-700">{user.name}</span>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </Link>
            </>
          )}
          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
