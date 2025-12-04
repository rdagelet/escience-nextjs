'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
    id: string;
    title: string;
    category: string;
    published: boolean;
    createdAt: string;
    coverImage: string | null;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(data);
        } catch (error) {
            console.error('Failed to fetch blogs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            fetchBlogs(); // Refresh list
        } catch (error) {
            console.error('Failed to delete blog', error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
                <Link
                    href="/admin/blogs/new"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    + New Post
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {blogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {blog.coverImage && (
                                            <div className="w-10 h-10 rounded bg-gray-700 overflow-hidden relative">
                                                <Image src={blog.coverImage} alt="" fill className="object-cover" />
                                            </div>
                                        )}
                                        <span className="text-white font-medium">{blog.title}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300">{blog.category}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${blog.published
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }`}
                                    >
                                        {blog.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/blogs/${blog.id}`}
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No blog posts yet. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
