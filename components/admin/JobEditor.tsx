'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JobEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        department: 'Engineering',
        location: 'Manila, Philippines',
        type: 'Full-time',
        description: '',
        requirements: [] as string[],
        isActive: true,
    });

    const [reqInput, setReqInput] = useState('');

    useEffect(() => {
        if (!isNew && params?.id) {
            fetch(`/api/careers/${params.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData(data);
                    setLoading(false);
                })
                .catch((err) => console.error(err));
        }
    }, [isNew, params?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew ? '/api/careers' : `/api/careers/${params?.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/careers');
                router.refresh();
            } else {
                alert('Failed to save job opening');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const addRequirement = () => {
        if (reqInput.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, reqInput.trim()],
            });
            setReqInput('');
        }
    };

    const removeRequirement = (index: number) => {
        const newReqs = [...formData.requirements];
        newReqs.splice(index, 1);
        setFormData({ ...formData, requirements: newReqs });
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? 'Post New Job' : 'Edit Job Opening'}
                </h1>
                <Link
                    href="/admin/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Job Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Department</label>
                        <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                        >
                            <option>Engineering</option>
                            <option>Sales & Marketing</option>
                            <option>Product</option>
                            <option>Customer Support</option>
                            <option>Human Resources</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                        >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-32"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Requirements</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={reqInput}
                            onChange={(e) => setReqInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                            placeholder="Add a requirement..."
                        />
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {formData.requirements.map((req, index) => (
                            <li key={index} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <span className="text-gray-300 text-sm">{req}</span>
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                    />
                    <label htmlFor="isActive" className="text-white">
                        Active (Visible on Careers page)
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                >
                    {saving ? 'Saving...' : 'Save Job Opening'}
                </button>
            </form>
        </div>
    );
}
