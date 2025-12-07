import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Smart Library - Digital Library Management System" />
            <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 selection:bg-indigo-500 selection:text-white">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Library</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-4 py-2 border-2 border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            Log in
                                        </Link>

                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="mb-8 inline-block">
                                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    📖 Your Smart Student Library Portal
                                </span>
                            </div>
                            <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                                <span className="block">Access Knowledge</span>
                                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Anytime, Anywhere</span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
                                Discover, borrow, and manage your study materials with ease. Track your loans, get smart reminders, and explore thousands of books all in one place.
                            </p>
                            <div className="mt-10 flex justify-center gap-4 flex-wrap">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-150 ease-in-out shadow-lg hover:shadow-xl"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Join Now - It's Free
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition duration-150 ease-in-out"
                                >
                                    See Features
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-20 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">✨ Student Features</h2>
                            <p className="mt-3 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                                Everything You Need for Better Learning
                            </p>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                Designed specifically for students to explore, borrow, and manage books efficiently
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl px-6 pb-8 h-full border-2 border-indigo-100 hover:border-indigo-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Student Management</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Manage student profiles, approval workflows, library cards, and account status with ease.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl px-6 pb-8 h-full border-2 border-purple-100 hover:border-purple-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20 0C22 10.998 17.5 6.253 12 6.253z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Book Inventory</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Complete catalog management with ISBN tracking, categories, availability status, and barcode scanning.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-6 pb-8 h-full border-2 border-blue-100 hover:border-blue-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Issue & Return</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Barcode/QR validation, instant book issue/return, automatic due date calculation, and status updates.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl px-6 pb-8 h-full border-2 border-violet-100 hover:border-violet-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Loan Tracking</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Real-time loan monitoring, due date alerts, overdue tracking, and automatic fine calculation.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl px-6 pb-8 h-full border-2 border-indigo-100 hover:border-indigo-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6 2a8 8 0 11-16 0 8 8 0 0116 0zm-2 7a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Smart Notifications</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Multi-channel alerts via email, SMS, and in-app notifications for due dates and reminders.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6 */}
                            <div className="pt-6">
                                <div className="flow-root bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl px-6 pb-8 h-full border-2 border-purple-100 hover:border-purple-300 transition">
                                    <div className="-mt-6">
                                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-semibold text-gray-900">Analytics & Reports</h3>
                                    <p className="mt-5 text-base text-gray-600">
                                        Comprehensive reporting with export options (CSV, PDF, Excel) and visual analytics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-16 bg-gradient-to-r from-green-500 to-cyan-500">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Ready to transform your library?
                        </h2>
                        <p className="mt-4 text-lg text-green-100">
                            Join hundreds of libraries managing their operations efficiently with Smart Library.
                        </p>
                        <Link
                            href={route('register')}
                            className="mt-8 inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-green-600 bg-white hover:bg-green-50 transition duration-150 ease-in-out shadow-lg"
                        >
                            Start Your Free Trial Today
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-semibold text-white">Smart Library</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                © 2025 Smart Library. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
