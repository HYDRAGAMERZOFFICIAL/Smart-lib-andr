import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19-2h-6v6h6V4zm-1 5h-4V5h4v4zM4 12h4v-2H4v2zm10-6h-6v2h6V6z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Library System</h1>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                    Sign in to manage your books, loans, and fines
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800 dark:bg-green-900/50 dark:text-green-200 border border-green-200 dark:border-green-700">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {status}
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div className="space-y-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 dark:text-gray-300 font-semibold" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="your@email.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value="Password" className="text-gray-700 dark:text-gray-300 font-semibold" />

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div>
                        <PrimaryButton className="w-full py-2.5" disabled={processing}>
                            {processing ? 'Signing in...' : 'Sign in'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition"
                    >
                        Create one now
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
