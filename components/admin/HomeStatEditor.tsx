'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomeStatEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        label: '',
        value: '',
        suffix: '',
        order: 0,
        active: true,
    });

    useEffect(() => {
        if (!isNew && params.id) {
            fetch(`/api/home-stats/${params.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData({
                        label: data.label,
                        value: data.value,
                        suffix: data.suffix || '',
                        order: data.order,
                        active: data.active,
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    alert('Failed to load home stat');
                    setLoading(false);
                });
        }
    }, [isNew, params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew
                ? '/api/home-stats'
                : `/api/home-stats/${params.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/home-stats');
                router.refresh();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to save home stat');
                setSaving(false);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while saving');
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="mb-8">
                <Link href="/admin/home-stats">
                    <button className="text-gray-400 hover:text-white mb-4 transition-colors">
                        ← Back to Stats
                    </button>
                </Link>
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? 'Create Home Stat' : 'Edit Home Stat'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    {/* Label */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 font-medium">
                            Label *
                        </label>
                        <input
                            type="text"
                            value={formData.label}
                            onChange={(e) =>
                                setFormData({ ...formData, label: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. Years in Business"
                            required
                        />
                    </div>

                    {/* Value */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 font-medium">
                            Value *
                        </label>
                        <input
                            type="text"
                            value={formData.value}
                            onChange={(e) =>
                                setFormData({ ...formData, value: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. 25"
                            required
                        />
                        <p className="text-sm text-gray-400 mt-1">
                            The numeric or text value to display
                        </p>
                    </div>

                    {/* Suffix */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 font-medium">
                            Suffix (optional)
                        </label>
                        <input
                            type="text"
                            value={formData.suffix}
                            onChange={(e) =>
                                setFormData({ ...formData, suffix: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. + or %"
                        />
                        <p className="text-sm text-gray-400 mt-1">
                            Optional suffix like +, %, etc.
                        </p>
                    </div>

                    {/* Order */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 font-medium">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) =>
                                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="0"
                        />
                        <p className="text-sm text-gray-400 mt-1">
                            Lower numbers appear first
                        </p>
                    </div>

                    {/* Active Toggle */}
                    <div className="mb-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) =>
                                    setFormData({ ...formData, active: e.target.checked })
                                }
                                className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:ring-2 focus:ring-teal-500"
                            />
                            <span className="ml-3 text-gray-300">Active (visible on homepage)</span>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
                    >
                        {saving ? 'Saving...' : isNew ? 'Create Stat' : 'Update Stat'}
                    </button>
                    <Link href="/admin/home-stats">
                        <button
                            type="button"
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
