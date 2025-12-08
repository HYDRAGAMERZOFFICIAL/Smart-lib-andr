import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentEdit({ student = {} }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: student.name || '',
        phone: student.phone || '',
        address: student.address || '',
        guardian_name: student.guardian_name || '',
        guardian_phone: student.guardian_phone || '',
        photo: null,
    });

    const [photoPreview, setPhotoPreview] = useState(student.photo ? `/storage/${student.photo}` : null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('student.profile.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Profile
                </h2>
            }
        >
            <Head title="Edit Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Photo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                                    {photoPreview && (
                                        <div className="mb-4">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {errors.photo && <p className="text-red-600 text-sm mt-2">{errors.photo}</p>}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.address && <p className="text-red-600 text-sm mt-2">{errors.address}</p>}
                                </div>

                                {/* Guardian Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name</label>
                                    <input
                                        type="text"
                                        value={data.guardian_name}
                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.guardian_name && <p className="text-red-600 text-sm mt-2">{errors.guardian_name}</p>}
                                </div>

                                {/* Guardian Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Phone</label>
                                    <input
                                        type="tel"
                                        value={data.guardian_phone}
                                        onChange={(e) => setData('guardian_phone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.guardian_phone && <p className="text-red-600 text-sm mt-2">{errors.guardian_phone}</p>}
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition disabled:opacity-50"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
