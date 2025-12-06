'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HomeStat {
    id: string;
    label: string;
    value: string;
    suffix: string | null;
    order: number;
    active: boolean;
}

export default function HomeStatsPage() {
    const [stats, setStats] = useState<HomeStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/home-stats')
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`Delete stat "${label}"?`)) return;

        try {
            const res = await fetch(`/api/home-stats/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setStats(stats.filter((s) => s.id !== id));
            } else {
                alert('Failed to delete stat');
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
                <h1 className="text-3xl font-bold text-white">Homepage Stats</h1>
                <Link href="/admin/home-stats/new">
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Add New Stat
                    </button>
                </Link>
            </div>

            {stats.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No stats yet</p>
                    <Link href="/admin/home-stats/new">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg">
                            Create Your First Stat
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-left p-4 text-gray-400">Order</th>
                                <th className="text-left p-4 text-gray-400">Label</th>
                                <th className="text-left p-4 text-gray-400">Value</th>
                                <th className="text-center p-4 text-gray-400">Status</th>
                                <th className="text-right p-4 text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat) => (
                                <tr
                                    key={stat.id}
                                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4 text-gray-400">{stat.order}</td>
                                    <td className="p-4 text-white font-medium">{stat.label}</td>
                                    <td className="p-4 text-gray-400">
                                        {stat.value}{stat.suffix || ''}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                stat.active
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}
                                        >
                                            {stat.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/home-stats/${stat.id}`}>
                                            <button className="text-teal-500 hover:text-teal-400 mr-4 transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(stat.id, stat.label)}
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
