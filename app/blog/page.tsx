'use client';

import Link from 'next/link';

const blogPosts = [
    {
        id: 1,
        title: "The Future of Field Sales Automation",
        category: "Industry Insights",
        date: "Dec 01, 2024",
        excerpt: "How AI and real-time data are transforming the way field sales teams operate in the pharmaceutical industry.",
        image: "📊"
    },
    {
        id: 2,
        title: "5 Ways to Optimize Inventory Management",
        category: "Tutorials",
        date: "Nov 28, 2024",
        excerpt: "Learn how to reduce shrinkage and improve stock visibility using SwiftPoint and IMS.",
        image: "📦"
    },
    {
        id: 3,
        title: "eScience Nominated for AWS Partner Award",
        category: "Company News",
        date: "Nov 15, 2024",
        excerpt: "We are proud to announce our nomination for the prestigious AWS Partner of the Year award.",
        image: "🏆"
    },
    {
        id: 4,
        title: "Going Paperless with Swift-Forms",
        category: "Product Updates",
        date: "Nov 10, 2024",
        excerpt: "Discover the new features in Swift-Forms 2.0 that make digital transformation easier than ever.",
        image: "📱"
    }
];

export default function BlogPage() {
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

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Industry Insights', 'Product Updates', 'Tutorials', 'Company News'].map((cat, idx) => (
                        <button
                            key={idx}
                            className={`px-6 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 ${idx === 0 ? 'bg-white text-black font-bold border-white' : 'text-gray-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                            <div className="h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                {post.image}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{post.category}</span>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{post.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                <Link href="#" className="inline-flex items-center text-sm font-semibold text-white hover:text-teal-400 transition-colors">
                                    Read Article
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="mt-20 bg-gradient-to-r from-blue-900/40 to-teal-900/40 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/images/grid.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Get the latest insights and product updates delivered directly to your inbox. No spam, just value.</p>
                        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-full bg-black/50 border border-white/20 text-white focus:outline-none focus:border-teal-400"
                            />
                            <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-teal-400 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
