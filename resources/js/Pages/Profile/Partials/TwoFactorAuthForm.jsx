import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
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

export default function TwoFactorAuthForm({ className = '', user = {} }) {
    const [confirmingDisable, setConfirmingDisable] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });
    
    const setupTwoFactor = () => {
        window.location.href = route('two-factor.setup');
    };
    
    const confirmDisableTwoFactor = () => {
        setConfirmingDisable(true);
    };
    
    const disableTwoFactor = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Disabling 2FA...');
        
        post(route('two-factor.disable'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Two-factor authentication has been disabled');
                closeModal();
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Failed to disable two-factor authentication');
            },
        });
    };
    
    const closeModal = () => {
        setConfirmingDisable(false);
        reset();
    };
    
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Two-Factor Authentication
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Add additional security to your account using two-factor authentication.
                </p>
            </header>

            <div className="mt-6">
                {user && user.two_factor_enabled ? (
                    <div>
                        <div className="mb-4 text-sm text-green-600">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Two-factor authentication is enabled.
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <DangerButton onClick={confirmDisableTwoFactor}>
                                Disable Two-Factor Authentication
                            </DangerButton>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 text-sm text-gray-600">
                            When two-factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
                        </div>
                        
                        <div className="mt-4">
                            <PrimaryButton onClick={setupTwoFactor}>
                                Enable Two-Factor Authentication
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </div>
            
            <Modal show={confirmingDisable} onClose={closeModal}>
                <form onSubmit={disableTwoFactor} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to disable two-factor authentication?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once two-factor authentication is disabled, you will no longer need to enter a verification code when logging in.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Disable
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}