import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm({
        id_number: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        course: '',
        semester: '',
        date_of_birth: '',
        guardian_name: '',
        guardian_phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

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
                    Create your student account and start exploring our library
                </p>
                
                {/* Progress Indicator */}
                <div className="mt-6 flex justify-center gap-2">
                    <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Step {step} of 3
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="space-y-5">
                    {/* STEP 1: Personal Information */}
                    {step === 1 && (
                        <>
                            <div>
                                <InputLabel htmlFor="id_number" value="Student ID Number *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="id_number"
                                    type="text"
                                    name="id_number"
                                    value={data.id_number}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="STU2024001"
                                    onChange={(e) => setData('id_number', e.target.value)}
                                    required
                                />
                                <InputError message={errors.id_number} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Full Name *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="John Doe"
                                    onChange={(e) => {
                                        const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                        setData('name', onlyLetters);
                                    }}
                                    required
                                    isFocused={true}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email Address *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="your@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Phone Number *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="9876543210"
                                    onChange={(e) => {
                                        const phone = e.target.value.replace(/[^\d+]/g, '');
                                        if (/^\+?\d*$/.test(phone)) {
                                            setData('phone', phone);
                                        }
                                    }}
                                    required
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="date_of_birth" value="Date of Birth *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    required
                                />
                                <InputError message={errors.date_of_birth} className="mt-2" />
                            </div>
                        </>
                    )}

                    {/* STEP 2: Academic Information */}
                    {step === 2 && (
                        <>
                            <div>
                                <InputLabel htmlFor="department" value="Department *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <select
                                    id="department"
                                    name="department"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Science">Science</option>
                                </select>
                                <InputError message={errors.department} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="course" value="Course *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="course"
                                    type="text"
                                    name="course"
                                    value={data.course}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="B.Tech / B.A / B.Com"
                                    onChange={(e) => setData('course', e.target.value)}
                                    required
                                />
                                <InputError message={errors.course} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="semester" value="Semester *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <select
                                    id="semester"
                                    name="semester"
                                    value={data.semester}
                                    onChange={(e) => setData('semester', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    <option value="1">1st Semester</option>
                                    <option value="2">2nd Semester</option>
                                    <option value="3">3rd Semester</option>
                                    <option value="4">4th Semester</option>
                                    <option value="5">5th Semester</option>
                                    <option value="6">6th Semester</option>
                                    <option value="7">7th Semester</option>
                                    <option value="8">8th Semester</option>
                                </select>
                                <InputError message={errors.semester} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="guardian_name" value="Guardian Name" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="guardian_name"
                                    type="text"
                                    name="guardian_name"
                                    value={data.guardian_name}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Parent/Guardian Name"
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                />
                                <InputError message={errors.guardian_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="guardian_phone" value="Guardian Phone" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="guardian_phone"
                                    type="tel"
                                    name="guardian_phone"
                                    value={data.guardian_phone}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="9876543210"
                                    onChange={(e) => {
                                        const phone = e.target.value.replace(/[^\d+]/g, '');
                                        if (/^\+?\d*$/.test(phone)) {
                                            setData('guardian_phone', phone);
                                        }
                                    }}
                                />
                                <InputError message={errors.guardian_phone} className="mt-2" />
                            </div>
                        </>
                    )}

                    {/* STEP 3: Address & Security */}
                    {step === 3 && (
                        <>
                            <div>
                                <InputLabel htmlFor="address" value="Address" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <textarea
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-4 py-2"
                                    placeholder="Your residential address"
                                    rows="3"
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Password requirements:
                                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                                        <li>5-15 characters</li>
                                        <li>Uppercase (A-Z), Lowercase (a-z), Number (0-9), Special (!@#()/.)</li>
                                    </ul>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password *" className="text-gray-700 dark:text-gray-300 font-semibold" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
                            >
                                Previous
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                            >
                                Next
                            </button>
                        ) : (
                            <PrimaryButton className="flex-1 py-2.5" disabled={processing}>
                                {processing ? 'Creating account...' : 'Create Account'}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
