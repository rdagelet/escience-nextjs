'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    description: string;
    features: string[];
    screenshots: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeScreenshot, setActiveScreenshot] = useState(0);

    useEffect(() => {
        // Note: In a real app, we'd fetch by slug from API. 
        // For now, fetching all and filtering (since we didn't make a slug API endpoint yet).
        // Optimization: Add /api/products/slug/[slug] later.
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((p: any) => p.slug === slug);
                setProduct(found || null);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-black text-white pt-32 text-center">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-black text-white pt-32 text-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                <Link href="/products" className="text-gray-400 hover:text-white mb-8 inline-block">
                    ← Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">
                            {product.name}
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed whitespace-pre-wrap">
                            {product.description}
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4 text-teal-400">Key Features</h3>
                            <ul className="space-y-3">
                                {product.features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="text-teal-500 mt-1">✓</span>
                                        <span className="text-gray-300">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/contact"
                            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity inline-block"
                        >
                            Request Demo
                        </Link>
                    </motion.div>

                    {/* Right: Screenshots Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        {product.screenshots.length > 0 ? (
                            <>
                                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-teal-900/20">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeScreenshot}
                                            src={product.screenshots[activeScreenshot]}
                                            alt={`${product.name} Screenshot ${activeScreenshot + 1}`}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Thumbnails */}
                                {product.screenshots.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {product.screenshots.map((shot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveScreenshot(index)}
                                                className={`relative w-24 aspect-video rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${activeScreenshot === index ? 'border-teal-500' : 'border-transparent opacity-50 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={shot} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                <span className="text-gray-500">No screenshots available</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
