'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from './ImageUploader';

export default function TestimonialEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        quote: '',
        avatar: '',
    });

    useEffect(() => {
        if (!isNew && params?.id) {
            fetch(`/api/testimonials/${params.id}`)
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
            const url = isNew ? '/api/testimonials' : `/api/testimonials/${params?.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/testimonials');
                router.refresh();
            } else {
                alert('Failed to save testimonial');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? 'Add New Testimonial' : 'Edit Testimonial'}
                </h1>
                <Link
                    href="/admin/testimonials"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Title/Position</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Company</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Testimonial Quote</label>
                        <textarea
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-32"
                            required
                        />
                    </div>

                    <ImageUploader
                        value={formData.avatar}
                        onChange={(url) => setFormData({ ...formData, avatar: url })}
                        label="Avatar Image (Optional)"
                        folder="electronicscience/testimonials"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
            </form>
        </div>
    );
}
