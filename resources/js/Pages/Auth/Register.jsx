import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        mobile: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

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
                    Create an account to access the library management system
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 dark:text-gray-300" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="John Doe"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                setData('name', onlyLetters);
                            }}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="mobile" value="Mobile Number (Optional)" className="text-gray-700 dark:text-gray-300" />
                        <TextInput
                            id="mobile"
                            type="text"
                            name="mobile"
                            value={data.mobile}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="6361232232"
                            autoComplete="tel"
                            onChange={(e) => {
                                const phone = e.target.value;
                                const formatted = phone.replace(/[^\d+]/g, ''); 
                                if (/^\+?\d*$/.test(formatted)) {
                                    setData('mobile', formatted);
                                }
                            }}
                        />
                        <InputError message={errors.mobile} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-gray-700 dark:text-gray-300" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />

                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Password must contain:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>5-15 characters in length</li>
                                <li>At least one uppercase letter (A-Z)</li>
                                <li>At least one lowercase letter (a-z)</li>
                                <li>At least one number (0-9)</li>
                                <li>At least one special character (!@#()/\.)</li>
                            </ul>
                        </div>

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-gray-700 dark:text-gray-300"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <PrimaryButton className="w-full py-2.5" disabled={processing}>
                            {processing ? 'Creating account...' : 'Create Account'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-green-600 hover:underline dark:text-green-400">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-green-600 hover:underline dark:text-green-400">Privacy Policy</a>.
                </p>
            </div>
        </GuestLayout>
    );
}
