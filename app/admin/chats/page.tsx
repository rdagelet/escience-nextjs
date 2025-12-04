'use client';

import { useState, useEffect } from 'react';

interface ChatLog {
    id: string;
    userQuery: string;
    aiResponse: string;
    createdAt: string;
}

export default function ChatLogsPage() {
    const [chats, setChats] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch('/api/chats');
            const data = await res.json();
            setChats(data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Chat Logs</h1>
                <span className="text-gray-400 text-sm">{chats.length} conversations</span>
            </div>

            <div className="space-y-4">
                {chats.map((chat) => (
                    <div key={chat.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs text-gray-500">
                                {new Date(chat.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <p className="text-xs text-blue-400 mb-1 font-medium">User</p>
                                <p className="text-white">{chat.userQuery}</p>
                            </div>
                            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                                <p className="text-xs text-teal-400 mb-1 font-medium">AI Assistant</p>
                                <p className="text-gray-300">{chat.aiResponse}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {chats.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-400 text-lg">No chat logs yet.</p>
                        <p className="text-gray-500 mt-2">Conversations will appear here once visitors use the chatbot.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
