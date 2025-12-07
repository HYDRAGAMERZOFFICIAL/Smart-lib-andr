import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '@/Components/Toast';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4 sm:p-6 md:p-8">
            <Toast />
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <a>
                        <Link className="transition-transform hover:scale-105">
                            <ApplicationLogo />
                        </Link>
                    </a>
                </div>

                <div className="w-full overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                    {children}
                </div>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} PERA FIN CORE Finance. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
