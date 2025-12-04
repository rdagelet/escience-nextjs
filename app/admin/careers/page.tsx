'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JobOpening {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    isActive: boolean;
    createdAt: string;
}

export default function CareersList() {
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/careers');
            const data = await res.json();
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job opening?')) return;

        try {
            await fetch(`/api/careers/${id}`, { method: 'DELETE' });
            fetchJobs(); // Refresh list
        } catch (error) {
            console.error('Failed to delete job', error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Careers / Job Openings</h1>
                <Link
                    href="/admin/careers/new"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    + Post Job
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-medium">{job.title}</td>
                                <td className="p-4 text-gray-300">{job.department}</td>
                                <td className="p-4 text-gray-400 text-sm">{job.location}</td>
                                <td className="p-4 text-gray-400 text-sm">{job.type}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${job.isActive
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}
                                    >
                                        {job.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/careers/${job.id}`}
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No job openings posted yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
