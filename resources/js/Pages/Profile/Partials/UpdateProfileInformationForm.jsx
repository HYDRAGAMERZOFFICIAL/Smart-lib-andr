import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    errors: propErrors,
}) {
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, patch, errors: formErrors, processing, recentlySuccessful, reset } =
        useForm({
            name: user.name,
            email: user.email,
            mobile: user.mobile || '',
            photo: null,
            _method: 'PATCH',
        });
        
    // Use errors from props if they exist, otherwise use form errors
    const errors = propErrors || formErrors;
    
    // Show toast notifications when status or errors change
    useEffect(() => {
        if (status === 'profile-updated') {
            toast.success('Profile updated successfully');
        }
        
        if (errors.error) {
            toast.error(errors.error);
        }
        
        if (status === 'verification-link-sent') {
            toast.success('Verification link sent successfully');
        }
    }, [status, errors]);

    const submit = (e) => {
        e.preventDefault();
        
        // Show loading toast
        const loadingToast = toast.loading('Updating profile...');
        
        // Create FormData object for file uploads
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        
        if (data.mobile) {
            formData.append('mobile', data.mobile);
        }
        
        // Append photo if it exists
        if (data.photo) {
            formData.append('photo', data.photo);
        }
        
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Profile updated successfully');
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                // Individual field errors will be shown by the form
                if (Object.keys(errors).length === 0) {
                    toast.error('An error occurred while updating your profile');
                } else {
                    // Show the first error message
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError);
                }
            }
        };
        
        // Use router.post instead of patch for file uploads
        router.post(route('profile.update'), formData, options);
    };
    
    const selectNewPhoto = () => {
        document.getElementById('photo').click();
    };
    
    const updatePhotoPreview = () => {
        const photo = document.getElementById('photo').files[0];
        
        if (!photo) return;
        
        setData('photo', photo);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        
        reader.readAsDataURL(photo);
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div className="mb-6">
                    <div className="flex items-center">
                        <div className="mr-4">
                            {photoPreview ? (
                                <div className="h-20 w-20 rounded-full overflow-hidden">
                                    <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                                </div>
                            ) : user.photo ? (
                                <div className="h-20 w-20 rounded-full overflow-hidden">
                                    <img src={`/storage/${user.photo}`} alt="Profile" className="h-full w-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                className="px-3 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={selectNewPhoto}
                            >
                                Select New Photo
                            </button>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                className="hidden"
                                accept="image/*"
                                onChange={updatePhotoPreview}
                            />
                            <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF up to 2MB</p>
                        </div>
                    </div>
                    <InputError className="mt-2" message={errors.photo} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>
                
                <div>
                    <InputLabel htmlFor="mobile" value="Mobile Number" />

                    <TextInput
                        id="mobile"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.mobile}
                        onChange={(e) => setData('mobile', e.target.value)}
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.mobile} />
                </div>
                
                <div>
                    <InputLabel htmlFor="role" value="Account Type" />
                    <div className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {user.role === 'admin' ? 'Administrator' : 'Member'}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Your account type determines your access level in the system</p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {user.email_verified_at ? (
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-800">
                                Email Verification
                            </h3>
                            <div className="mt-1 text-sm text-gray-600">
                                {user.email_verified_at ? (
                                    <p>Your email is verified on {new Date(user.email_verified_at).toLocaleDateString()}</p>
                                ) : (
                                    <p>
                                        Your email address is not verified.
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="ml-1 rounded-md text-sm text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Click here to send verification email.
                                        </Link>
                                    </p>
                                )}
                            </div>
                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {errors.error && (
                    <div className="mt-2 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful || status === 'profile-updated'}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">
                            Profile updated successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
