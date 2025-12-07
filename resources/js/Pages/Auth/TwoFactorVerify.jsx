import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// Inline toast utility in case the import fails
const toast = {
    success: (message) => {
        console.log('Success:', message);
        alert('Success: ' + message);
        return 'toast-id';
    },
    error: (message) => {
        console.error('Error:', message);
        alert('Error: ' + message);
        return 'toast-id';
    },
    loading: (message) => {
        console.log('Loading:', message);
        return 'toast-id';
    },
    dismiss: (id) => {
        console.log('Dismissed toast:', id);
    }
};

export default function TwoFactorVerify() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });
    
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);
    
    const { data: recoveryData, setData: setRecoveryData, post: postRecovery, processing: recoveryProcessing, errors: recoveryErrors } = useForm({
        recovery_code: '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Verifying code...');
        
        post(route('two-factor.validate'), {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Verification successful');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('The verification code is invalid');
            },
        });
    };
    
    const handleRecoverySubmit = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Verifying recovery code...');
        
        postRecovery(route('two-factor.recovery'), {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Recovery code accepted');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('The recovery code is invalid');
            },
        });
    };
    
    return (
        <GuestLayout>
            <Head title="Two-Factor Authentication" />
            
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {useRecoveryCode 
                        ? 'Please enter one of your recovery codes to continue.' 
                        : 'Please enter the verification code from your authenticator app.'}
                </p>
            </div>
            
            {!useRecoveryCode ? (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="code" value="Verification Code" className="text-gray-700 dark:text-gray-300" />
                            
                            <TextInput
                                id="code"
                                type="text"
                                name="code"
                                value={data.code}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                autoComplete="one-time-code"
                                isFocused={true}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            
                            <InputError message={errors.code} className="mt-2" />
                        </div>
                        
                        <div>
                            <PrimaryButton className="w-full py-2.5" disabled={processing}>
                                {processing ? 'Verifying...' : 'Verify'}
                            </PrimaryButton>
                        </div>
                        
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => setUseRecoveryCode(true)}
                            >
                                Use a recovery code
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRecoverySubmit}>
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="recovery_code" value="Recovery Code" className="text-gray-700 dark:text-gray-300" />
                            
                            <TextInput
                                id="recovery_code"
                                type="text"
                                name="recovery_code"
                                value={recoveryData.recovery_code}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter recovery code"
                                isFocused={true}
                                onChange={(e) => setRecoveryData('recovery_code', e.target.value)}
                                required
                            />
                            
                            <InputError message={recoveryErrors.recovery_code} className="mt-2" />
                        </div>
                        
                        <div>
                            <PrimaryButton className="w-full py-2.5" disabled={recoveryProcessing}>
                                {recoveryProcessing ? 'Verifying...' : 'Verify'}
                            </PrimaryButton>
                        </div>
                        
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => setUseRecoveryCode(false)}
                            >
                                Use an authentication code
                            </button>
                        </div>
                    </div>
                </form>
            )}
            
            <div className="mt-6 text-center">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    Log Out
                </Link>
            </div>
        </GuestLayout>
    );
}