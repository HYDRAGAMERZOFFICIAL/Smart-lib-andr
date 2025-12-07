import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import classNames from 'classnames';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Books', href: '/books' },
  { label: 'Loans', href: '/loans' },
  { label: 'Library Card', href: '/card' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Profile', href: '/profile' },
];

export default function Sidebar() {
  const page = usePage();
  const currentRoute = page.url;

  return (
    <aside className="w-64 bg-indigo-700 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Menu</h2>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                'block px-4 py-2 rounded transition-colors',
                currentRoute === item.href
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
