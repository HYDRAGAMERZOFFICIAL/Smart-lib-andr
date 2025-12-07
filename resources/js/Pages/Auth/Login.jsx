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

            <div className="mb-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">Smart Library</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your library management account
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 dark:bg-green-900/50 dark:text-green-400">
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
                        <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 dark:text-gray-300" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="your@email.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value="Password" className="text-gray-700 dark:text-gray-300" />

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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
                                className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
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

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
