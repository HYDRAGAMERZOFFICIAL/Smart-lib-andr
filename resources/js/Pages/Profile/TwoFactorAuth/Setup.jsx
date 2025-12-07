import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

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

export default function Setup({ qrCodeUrl, secretKey, qrCodeSvg }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        const loadingToast = toast.loading('Verifying code...');
        
        post(route('two-factor.enable'), {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Two-factor authentication has been enabled');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Failed to verify code');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Set Up Two-Factor Authentication
                </h2>
            }
        >
            <Head title="Set Up Two-Factor Authentication" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <section>
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Set Up Two-Factor Authentication
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Enhance your account security by enabling two-factor authentication.
                                    </p>
                                </header>

                                <div className="mt-6">
                                    <div className="mb-6">
                                        <p className="mb-2 text-sm text-gray-700">
                                            1. Scan the QR code below with your Google Authenticator app.
                                        </p>
                                        <div className="mb-4 mt-4 flex justify-center">
                                            <div className="p-4 bg-white rounded-lg shadow-md">
                                                <QRCodeSVG 
                                                    value={qrCodeUrl} 
                                                    size={200} 
                                                    level="M"
                                                    includeMargin={true}
                                                    className="mx-auto"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="mb-2 text-sm text-gray-700">
                                            2. If you can't scan the QR code, enter this code manually in your app:
                                        </p>
                                        <div className="mb-4 mt-2 rounded-md bg-gray-100 p-3">
                                            <code className="text-sm font-mono">{secretKey}</code>
                                        </div>
                                    </div>

                                    <form onSubmit={submit}>
                                        <div className="mb-6">
                                            <p className="mb-2 text-sm text-gray-700">
                                                3. Enter the 6-digit code from your authenticator app:
                                            </p>
                                            <div className="mt-2">
                                                <InputLabel htmlFor="code" value="Verification Code" />
                                                <TextInput
                                                    id="code"
                                                    type="text"
                                                    name="code"
                                                    value={data.code}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    required
                                                    autoComplete="off"
                                                    maxLength={6}
                                                />
                                                <InputError message={errors.code} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={processing}>
                                                {processing ? 'Verifying...' : 'Verify and Enable'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}