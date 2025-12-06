'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MultiImageUploader from './MultiImageUploader';

export default function ProductEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        features: [] as string[],
        screenshots: [] as string[],
        order: 0,
    });

    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        if (!isNew && params?.id) {
            fetch(`/api/products/${params.id}`)
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
            const url = isNew ? '/api/products' : `/api/products/${params?.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/products');
                router.refresh();
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const addFeature = (value: string) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, value.trim()],
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? 'Add New Product' : 'Edit Product'}
                </h1>
                <Link
                    href="/admin/products"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                                    required
                                />
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
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                            <label className="block text-gray-400 text-sm mb-2">Features</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature(featureInput))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                                    placeholder="Add a feature..."
                                />
                                <button
                                    type="button"
                                    onClick={() => addFeature(featureInput)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg"
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {formData.features.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <span className="text-gray-300 text-sm">{item}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                            <MultiImageUploader
                                values={formData.screenshots}
                                onChange={(urls) => setFormData({ ...formData, screenshots: urls })}
                                label="Product Screenshots"
                                folder="electronicscience/products"
                                maxImages={10}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
