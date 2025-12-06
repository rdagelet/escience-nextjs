'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Testimonial {
    id: string;
    name: string;
    title: string;
    company: string;
    quote: string;
    avatar: string | null;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/testimonials')
            .then((res) => res.json())
            .then((data) => {
                setTestimonials(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete testimonial from ${name}?`)) return;

        try {
            const res = await fetch(`/api/testimonials/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setTestimonials(testimonials.filter((t) => t.id !== id));
            } else {
                alert('Failed to delete testimonial');
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
                <h1 className="text-3xl font-bold text-white">Testimonials</h1>
                <Link href="/admin/testimonials/new">
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Add New Testimonial
                    </button>
                </Link>
            </div>

            {testimonials.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-4">No testimonials yet</p>
                    <Link href="/admin/testimonials/new">
                        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg">
                            Create Your First Testimonial
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-left p-4 text-gray-400">Name</th>
                                <th className="text-left p-4 text-gray-400">Company</th>
                                <th className="text-left p-4 text-gray-400">Quote Preview</th>
                                <th className="text-right p-4 text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((testimonial) => (
                                <tr
                                    key={testimonial.id}
                                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4 text-white">
                                        <div className="font-medium">{testimonial.name}</div>
                                        <div className="text-sm text-gray-400">{testimonial.title}</div>
                                    </td>
                                    <td className="p-4 text-gray-400">{testimonial.company}</td>
                                    <td className="p-4 text-gray-400">
                                        {testimonial.quote.substring(0, 80)}
                                        {testimonial.quote.length > 80 ? '...' : ''}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/testimonials/${testimonial.id}`}>
                                            <button className="text-teal-500 hover:text-teal-400 mr-4 transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(testimonial.id, testimonial.name)}
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
