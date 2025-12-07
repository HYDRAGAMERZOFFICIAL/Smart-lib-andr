import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    //password regex and verification for matching password
    const updatePassword = (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#()\/.]).+$/;

        if (!passwordRegex.test(data.password)) {
            toast.error(
                'Password must include uppercase, lowercase, number, and special character (!@#()/.)'
            );
            return;
        }

        if (data.password !== data.password_confirmation) {
            toast.error('New password and confirmation do not match');
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading('Updating password...');

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Password updated successfully');
                reset();
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                    toast.error(errors.password);
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                    toast.error(errors.current_password);
                }
                
                if (!Object.keys(errors).length) {
                    toast.error('An error occurred while updating your password');
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
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
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
