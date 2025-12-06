'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WhyFeature {
    id: string;
    title: string;
    description: string;
    order: number;
    active: boolean;
}

export default function WhyFeaturesPage() {
    const [features, setFeatures] = useState<WhyFeature[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/why-features')
            .then((res) => res.json())
            .then((data) => {
                setFeatures(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete why feature "${title}"?`)) return;

        try {
            const res = await fetch(`/api/why-features/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFeatures(features.filter((f) => f.id !== id));
            } else {
                alert('Failed to delete why feature');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Why eScience Features</h1>
                <Link href="/admin/why-features/new">
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Add New Feature
                    </button>
                </Link>
            </div>

            {features.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No why features yet</p>
                    <Link href="/admin/why-features/new">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg">
                            Create Your First Feature
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-left p-4 text-gray-400">Order</th>
                                <th className="text-left p-4 text-gray-400">Title</th>
                                <th className="text-left p-4 text-gray-400">Description Preview</th>
                                <th className="text-center p-4 text-gray-400">Status</th>
                                <th className="text-right p-4 text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature) => (
                                <tr
                                    key={feature.id}
                                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4 text-gray-400">{feature.order}</td>
                                    <td className="p-4 text-white font-medium">{feature.title}</td>
                                    <td className="p-4 text-gray-400">
                                        {feature.description.substring(0, 80)}
                                        {feature.description.length > 80 ? '...' : ''}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                feature.active
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}
                                        >
                                            {feature.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/why-features/${feature.id}`}>
                                            <button className="text-teal-500 hover:text-teal-400 mr-4 transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(feature.id, feature.title)}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
