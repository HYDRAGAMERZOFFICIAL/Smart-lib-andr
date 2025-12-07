import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    
    // Show toast notification when status changes
    useEffect(() => {
        if (status === 'verification-link-sent') {
            toast.success('A new verification link has been sent to your email address');
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        
        // Show loading toast
        const loadingToast = toast.loading('Sending verification email...');
        
        post(route('verification.send'), {
            onSuccess: () => {
                toast.dismiss(loadingToast);
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('An error occurred while sending the verification email');
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600">
                Thank you for signing up! Your account has been created successfully.
                An administrator will review and verify your account. You will receive
                an email notification once your account has been approved.
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>Account Status:</strong> Pending Admin Verification
                </p>
                <p className="text-xs text-blue-600 mt-2">
                    Please wait for an administrator to verify your email address and approve your account.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
