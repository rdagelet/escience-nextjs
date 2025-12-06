'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from './ImageUploader';

export default function BlogEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Industry Insights',
        coverImage: '',
        published: false,
    });

    useEffect(() => {
        if (!isNew && params?.id) {
            fetch(`/api/blogs/${params.id}`)
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
            const url = isNew ? '/api/blogs' : `/api/blogs/${params?.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/blogs');
                router.refresh();
            } else {
                alert('Failed to save blog post');
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
                    {isNew ? 'Create New Post' : 'Edit Post'}
                </h1>
                <Link
                    href="/admin/blogs"
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
                                <label className="block text-gray-400 text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Content (Markdown supported)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-96 font-mono"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                            <h3 className="text-white font-bold mb-4">Publishing</h3>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                                >
                                    <option>Industry Insights</option>
                                    <option>Product Updates</option>
                                    <option>Tutorials</option>
                                    <option>Company News</option>
                                </select>
                            </div>
                            <ImageUploader
                                value={formData.coverImage}
                                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                label="Cover Image"
                                folder="electronicscience/blog"
                            />
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                                />
                                <label htmlFor="published" className="text-white">
                                    Publish immediately
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                            >
                                {saving ? 'Saving...' : 'Save Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
