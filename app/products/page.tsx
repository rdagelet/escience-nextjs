'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    features: string[];
    screenshots: string[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">
                        Our Products
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover our suite of innovative solutions designed to transform your business operations.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all group"
                            >
                                {product.screenshots[0] ? (
                                    <div className="h-48 bg-gray-900 relative overflow-hidden">
                                        <img
                                            src={product.screenshots[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                        <span className="text-4xl">📦</span>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-teal-400 transition-colors">
                                        {product.name}
                                    </h2>
                                    <p className="text-gray-400 mb-4 line-clamp-3">
                                        {product.description}
                                    </p>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="inline-block bg-white/10 hover:bg-teal-500 hover:text-white text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
