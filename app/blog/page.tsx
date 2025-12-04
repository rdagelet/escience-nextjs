'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    slug: string;
    createdAt: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetch('/api/blogs')
            .then((res) => res.json())
            .then((data) => {
                // Filter only published blogs if this was a real public API, 
                // but for now our API returns all. In a real app, the API should filter.
                // Let's assume the API returns what we need or we filter here.
                const publishedBlogs = data.filter((blog: any) => blog.published);
                setBlogs(publishedBlogs);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const categories = ['All', 'Industry Insights', 'Product Updates', 'Tutorials', 'Company News'];

    const filteredBlogs = activeCategory === 'All'
        ? blogs
        : blogs.filter(blog => blog.category === activeCategory);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">
                        Resources & Insights
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Stay updated with the latest trends in mobile technology, sales automation, and company news.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading articles...</div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {filteredBlogs.map((blog) => (
                            <article key={blog.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
                                <div className="h-48 bg-gray-800 relative overflow-hidden">
                                    {blog.coverImage ? (
                                        <Image
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-600">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-teal-400 border border-teal-500/30">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-gray-500 text-xs mb-3">{new Date(blog.createdAt).toLocaleDateString()}</div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-teal-400 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                    <Link href={`#`} className="inline-flex items-center text-teal-400 text-sm font-medium hover:gap-2 transition-all">
                                        Read Article <span className="ml-1">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-400 text-lg">No articles found in this category.</p>
                    </div>
                )}

                {/* Newsletter Section */}
                <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/images/grid.svg')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
                        <p className="text-gray-400 mb-8">
                            Get the latest insights and product updates delivered directly to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-6 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                            />
                            <button className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
