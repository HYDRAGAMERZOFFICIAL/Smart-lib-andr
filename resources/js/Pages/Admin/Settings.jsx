import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';

export default function Settings({ settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        app_name: settings.app_name || 'PERAFINCORE',
        currency_symbol: settings.currency_symbol || '₹',
        allow_registration: settings.allow_registration || true,
        maintenance_mode: settings.maintenance_mode || false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    System Settings
                </h2>
            }
        >
            <Head title="System Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="app_name" value="Application Name" />
                                <TextInput
                                    id="app_name"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.app_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="currency_symbol" value="Currency Symbol" />
                                <TextInput
                                    id="currency_symbol"
                                    value={data.currency_symbol}
                                    onChange={(e) => setData('currency_symbol', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.currency_symbol} className="mt-2" />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="allow_registration"
                                    type="checkbox"
                                    checked={data.allow_registration}
                                    onChange={(e) => setData('allow_registration', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="allow_registration" className="ml-2 block text-sm text-gray-900">
                                    Allow User Registration
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="maintenance_mode"
                                    type="checkbox"
                                    checked={data.maintenance_mode}
                                    onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                                    Maintenance Mode
                                </label>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Save Settings</PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600">Settings saved successfully.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}