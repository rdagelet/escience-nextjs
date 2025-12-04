'use client';

import { useState, useEffect } from 'react';

interface KnowledgeChunk {
    id: string;
    content: string;
    metadata: any;
    createdAt: string;
}

export default function KnowledgePage() {
    const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [content, setContent] = useState('');
    const [source, setSource] = useState('');

    useEffect(() => {
        fetchChunks();
    }, []);

    const fetchChunks = async () => {
        try {
            const res = await fetch('/api/knowledge');
            const data = await res.json();
            setChunks(data);
        } catch (error) {
            console.error('Failed to fetch knowledge', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setUploading(true);
        try {
            const res = await fetch('/api/knowledge/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, source }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(`✅ Successfully created ${data.chunksCreated} knowledge chunks!`);
                setContent('');
                setSource('');
                fetchChunks();
            } else {
                alert('❌ Failed to upload knowledge');
            }
        } catch (error) {
            console.error(error);
            alert('❌ An error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this knowledge chunk?')) return;

        try {
            await fetch('/api/knowledge', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchChunks();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
                <p className="text-gray-400">
                    Upload documentation to train the AI chatbot. Text is automatically chunked and embedded.
                </p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Add Knowledge</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Source Name (optional)</label>
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g., Product Guide v2.0"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your documentation here... (automatically chunked into ~500 word segments)"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 h-64 font-mono text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {uploading ? 'Processing & Embedding...' : 'Upload Knowledge'}
                    </button>
                </div>
            </form>

            {/* Knowledge Chunks List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Existing Knowledge ({chunks.length} chunks)</h2>

                {chunks.map((chunk) => (
                    <div key={chunk.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-xs text-gray-500">
                                    {new Date(chunk.createdAt).toLocaleString()}
                                </span>
                                {chunk.metadata?.source && (
                                    <span className="ml-3 text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded">
                                        {chunk.metadata.source}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(chunk.id)}
                                className="text-red-400 hover:text-red-300 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-3">{chunk.content}</p>
                    </div>
                ))}

                {chunks.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-400 text-lg">No knowledge added yet.</p>
                        <p className="text-gray-500 mt-2">Upload documentation above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
