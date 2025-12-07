import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, impersonating } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
        
    const handleStopImpersonating = () => {
        router.post(route('stop.impersonating'));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />
            
            {impersonating && (
                <div className="bg-amber-500 py-2 text-center text-white">
                    <div className="container mx-auto flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>You are currently logged in as <strong>{user.name}</strong></span>
                        <button 
                            onClick={handleStopImpersonating}
                            className="ml-4 rounded-md bg-white px-3 py-1 text-sm font-medium text-amber-700 hover:bg-amber-50"
                        >
                            Return to Admin Account
                        </button>
                    </div>
                </div>
            )}
            <nav className="border-b border-green-100 bg-gradient-to-r from-white to-green-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('students.index')}
                                    active={route().current('students.*')}
                                >
                                    Students
                                </NavLink>
                                <NavLink
                                    href={route('books.index')}
                                    active={route().current('books.*')}
                                >
                                    Books
                                </NavLink>
                                <NavLink
                                    href={route('issue-return.index')}
                                    active={route().current('issue-return.*')}
                                >
                                    Issue/Return
                                </NavLink>
                                <NavLink
                                    href={route('loans.index')}
                                    active={route().current('loans.*')}
                                >
                                    Loans
                                </NavLink>
                                <NavLink
                                    href={route('reports.index')}
                                    active={route().current('reports.*')}
                                >
                                    Reports
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                {user.role === 'admin' && (
                                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                        Admin
                                                    </span>
                                                )}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        {user.role === 'admin' && (
                                            <Dropdown.Link
                                                href={route('admin.dashboard')}
                                            >
                                                Admin Dashboard
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('students.index')}
                            active={route().current('students.*')}
                        >
                            Students
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('books.index')}
                            active={route().current('books.*')}
                        >
                            Books
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('issue-return.index')}
                            active={route().current('issue-return.*')}
                        >
                            Issue/Return
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('loans.index')}
                            active={route().current('loans.*')}
                        >
                            Loans
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('reports.index')}
                            active={route().current('reports.*')}
                        >
                            Reports
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 flex items-center">
                                {user.name}
                                {user.role === 'admin' && (
                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            {user.role === 'admin' && (
                                <ResponsiveNavLink href={route('admin.dashboard')}>
                                    Admin Dashboard
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gradient-to-r from-white to-green-50 border-b border-green-100 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
